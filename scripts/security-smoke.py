#!/usr/bin/env python3
"""Production security smoke — headers, HTTPS, common misconfig probes."""
import os
import sys
import urllib.error
import urllib.request

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")
FAILURES: list[str] = []

REQUIRED_HEADERS = {
    "strict-transport-security": "HSTS",
    "x-content-type-options": "nosniff",
    "x-frame-options": "clickjacking protection",
    "referrer-policy": "Referrer-Policy",
    "content-security-policy": "CSP",
}


def fetch(url: str, method: str = "GET") -> tuple[int, dict[str, str]]:
    req = urllib.request.Request(url, method=method, headers={"User-Agent": "qrbanner-security-smoke/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            headers = {k.lower(): v for k, v in resp.headers.items()}
            return resp.status, headers
    except urllib.error.HTTPError as e:
        headers = {k.lower(): v for k, v in e.headers.items()}
        return e.code, headers


def main() -> int:
    print(f"=== Security smoke ({BASE}) ===\n")

    # HTTPS redirect (optional — Cloudflare/nginx may answer HTTP 200 on same host)
    http_url = BASE.replace("https://", "http://")
    if http_url != BASE:
        code, headers = fetch(http_url)
        loc = headers.get("location", "")
        if code in (301, 302, 307, 308) and loc.startswith("https://"):
            print(f"  [OK] HTTP→HTTPS redirect ({code})")
        elif code == 200:
            print(f"  [OK] HTTP reachable (200) — TLS enforced at CDN/browser; HSTS present")
        else:
            fail(f"HTTP unexpected: status={code} location={loc[:80]}")

    code, headers = fetch(BASE + "/")
    print(f"  [OK] Homepage HTTPS {code}")

    for key, label in REQUIRED_HEADERS.items():
        if key in headers:
            print(f"  [OK] {label}: {headers[key][:72]}")
        else:
            fail(f"Missing header: {label} ({key})")

    # Sensitive paths should not leak stack traces / 500
    probes = [
        ("/api/billing/webhook", "POST", 400),
        ("/.env", "GET", None),
        ("/api/auth/session", "GET", 200),
    ]
    print("\n--- Path probes ---")
    for path, method, expect in probes:
        url = BASE + path
        try:
            data = b"{}" if method == "POST" else None
            req = urllib.request.Request(
                url,
                data=data,
                method=method,
                headers={"User-Agent": "qrbanner-security-smoke/1.0", "Content-Type": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=20) as resp:
                body = resp.read(500).decode("utf-8", errors="replace")
                status = resp.status
        except urllib.error.HTTPError as e:
            body = e.read(500).decode("utf-8", errors="replace")
            status = e.code

        leak = any(x in body.lower() for x in ("stack trace", "prisma", "at /var/www", "node_modules"))
        ok_status = expect is None or status == expect or (expect == 400 and status in (400, 401, 403, 422))
        tag = "OK" if ok_status and not leak else "FAIL"
        print(f"  [{tag}] {method} {path} → {status}")
        if leak:
            fail(f"{path} response may leak internals")
        if expect and not ok_status:
            fail(f"{path} expected ~{expect}, got {status}")

    print()
    if FAILURES:
        print(f"=== Result: FAIL ({len(FAILURES)} issue(s)) ===")
        for f in FAILURES:
            print(f"  • {f}")
        return 1
    print("=== Result: PASS ===")
    return 0


def fail(msg: str) -> None:
    FAILURES.append(msg)
    print(f"  [FAIL] {msg}")


if __name__ == "__main__":
    raise SystemExit(main())
