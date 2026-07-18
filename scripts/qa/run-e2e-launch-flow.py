#!/usr/bin/env python3
"""Launch E2E: create -> edit -> scan -> analytics -> edge cases via live REST API.

Uses an isolated VPS test user (same helper as run-e2e-free-limit). Covers:
  1. QR create (201) + list + detail
  2. Edit destination (PATCH) and verify
  3. Scan short link (expects redirect to target)
  4. Analytics endpoint reflects the scan
  5. Edge cases: empty name, invalid category, javascript: URL, 10k-char name,
     unicode/special chars, invalid JSON
  6. Rate-limit headers present on API responses
Cleans up all test data at the end.
"""
from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import paramiko  # noqa: E402

HOST = "31.97.113.170"
BASE = "https://qrbanner.com"
REPO = Path(__file__).resolve().parent.parent.parent

PASS = 0
FAIL = 0


def check(name: str, ok: bool, detail: str = "") -> None:
    global PASS, FAIL
    mark = "PASS" if ok else "FAIL"
    if ok:
        PASS += 1
    else:
        FAIL += 1
    print(f"  [{mark}] {name}" + (f" — {detail[:140]}" if detail else ""))


def ssh_client() -> paramiko.SSHClient:
    pw = os.environ.get("QRBANNER_SSH_PW", "112358Onrks..")
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username="root", password=pw, timeout=20)
    return c


def run_remote_node(c: paramiko.SSHClient, local_script: Path, remote_name: str) -> str:
    sftp = c.open_sftp()
    remote = f"/var/www/qrbanner/{remote_name}"
    sftp.put(str(local_script), remote)
    sftp.close()
    cmd = f"cd /var/www/qrbanner && set -a && . ./.env 2>/dev/null; set +a; node {remote_name}; rm -f {remote_name}"
    _, stdout, stderr = c.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if err:
        print("  remote stderr:", err[:300])
    return out


def api(method: str, path: str, key: str, body: dict | str | None = None,
        raw: bool = False) -> tuple[int, str, dict]:
    data = None
    if body is not None:
        data = (body if isinstance(body, str) else json.dumps(body)).encode()
    req = urllib.request.Request(
        BASE + path,
        data=data,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method=method,
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            return res.status, res.read().decode("utf-8", "replace"), dict(res.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace"), dict(e.headers)


def http_get(url: str, follow: bool = False) -> tuple[int, str, dict]:
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *a, **k):
            return None

    opener = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (launch-e2e)"})
    try:
        with opener.open(req, timeout=30) as res:
            return res.status, res.read().decode("utf-8", "replace")[:500], dict(res.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")[:500], dict(e.headers)


def main() -> int:
    print(f"=== Launch E2E flow ({BASE}) ===\n")
    c = ssh_client()
    try:
        out = run_remote_node(c, REPO / "scripts" / "qa" / "e2e-free-limit-user.cjs", "e2e-tmp-user.cjs")
        info = json.loads(out.splitlines()[-1])
        key = info["key"]
        print(f"[setup] test user {info['userId'][:10]}...\n")

        print("--- 1. Create / list / detail ---")
        status, body, headers = api("POST", "/api/v1/qr", key,
                                    {"name": "Launch E2E", "category": "url", "url": "https://qrbanner.com/features"})
        check("create QR 201", status == 201, f"HTTP {status}")
        qr = json.loads(body).get("data", {})
        qr_id = qr.get("id")
        short = qr.get("short_code") or qr.get("shortCode")
        check("response has id + short_code", bool(qr_id and short))
        check("rate-limit headers present", "X-RateLimit-Limit" in headers or "x-ratelimit-limit" in {k.lower() for k in headers},
              str([k for k in headers if "ratelimit" in k.lower()][:3]))

        status, body, _ = api("GET", "/api/v1/qr", key)
        check("list QRs 200", status == 200, f"HTTP {status}")

        status, body, _ = api("GET", f"/api/v1/qr/{qr_id}", key)
        check("detail 200", status == 200)

        print("\n--- 2. Edit destination ---")
        status, body, _ = api("PATCH", f"/api/v1/qr/{qr_id}", key,
                              {"url": "https://qrbanner.com/pricing"})
        if status == 405:
            status, body, _ = api("PUT", f"/api/v1/qr/{qr_id}", key, {"url": "https://qrbanner.com/pricing"})
        check("edit destination", status == 200, f"HTTP {status}")
        status, body, _ = api("GET", f"/api/v1/qr/{qr_id}", key)
        check("edit persisted", "pricing" in body, body[:100] if "pricing" not in body else "")

        print("\n--- 3. Scan short link ---")
        status, _, headers = http_get(f"{BASE}/s/{short}")
        loc = headers.get("Location", headers.get("location", ""))
        check("scan redirects", status in (301, 302, 307, 308), f"HTTP {status}")
        check("redirect goes to edited target", "pricing" in loc, loc[:120])

        print("\n--- 4. Analytics reflects scan ---")
        time.sleep(3)
        status, body, _ = api("GET", f"/api/v1/qr/{qr_id}/analytics", key)
        check("analytics 200", status == 200, f"HTTP {status}")
        try:
            an = json.loads(body)
            total = json.dumps(an)
            check("scan counted (>=1)", '"total_scans": 0' not in total and '"totalScans":0' not in total.replace(" ", ""),
                  total[:120])
        except Exception as e:
            check("analytics parse", False, str(e))

        print("\n--- 5. Edge cases ---")
        status, body, _ = api("POST", "/api/v1/qr", key, {"name": "", "category": "url", "url": "https://x.com"})
        check("empty name -> 400", status == 400, f"HTTP {status}")

        status, body, _ = api("POST", "/api/v1/qr", key, {"name": "x", "category": "nope", "url": "https://x.com"})
        check("invalid category rejected", status in (400, 422), f"HTTP {status}: {body[:80]}")

        status, body, _ = api("POST", "/api/v1/qr", key,
                              {"name": "xss", "category": "url", "url": "javascript:alert(1)"})
        check("javascript: URL rejected", status in (400, 422), f"HTTP {status}: {body[:80]}")

        status, body, _ = api("POST", "/api/v1/qr", key,
                              {"name": "A" * 10000, "category": "url", "url": "https://qrbanner.com"})
        check("10k-char name handled (400 or truncated 201, not 500)", status != 500, f"HTTP {status}")
        if status == 201:
            api("DELETE", f"/api/v1/qr/{json.loads(body)['data']['id']}", key)

        status, body, _ = api("POST", "/api/v1/qr", key,
                              {"name": "Ünïcode 测试 🎯 <b>&amp;</b>", "category": "url", "url": "https://qrbanner.com"})
        check("unicode/special-char name ok (not 500)", status != 500, f"HTTP {status}")
        if status == 201:
            api("DELETE", f"/api/v1/qr/{json.loads(body)['data']['id']}", key)

        status, body, _ = api("POST", "/api/v1/qr", key, "{not json")
        check("malformed JSON -> 4xx/500-safe", status in (400, 422, 500), f"HTTP {status}")

        status, body, _ = api("GET", "/api/v1/qr/nonexistent-id-123", key)
        check("unknown id -> 404", status == 404, f"HTTP {status}")

        status, body, _ = api("GET", "/api/v1/qr", "qb_live_invalidkey000000000000")
        check("invalid API key -> 401", status == 401, f"HTTP {status}")

    finally:
        out = run_remote_node(c, REPO / "scripts" / "qa" / "e2e-free-limit-cleanup.cjs", "e2e-tmp-clean.cjs")
        print(f"\n[cleanup] {out.splitlines()[-1] if out else '?'}")
        c.close()

    print(f"\n=== Result: {PASS} pass / {FAIL} fail ===")
    return 1 if FAIL else 0


if __name__ == "__main__":
    sys.exit(main())
