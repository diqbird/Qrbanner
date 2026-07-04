#!/usr/bin/env python3
"""Billing smoke: public status endpoint + webhook rejection semantics (no secrets)."""
import json
import os
import subprocess
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")
FAILURES: list[str] = []


def fail(msg: str) -> None:
    FAILURES.append(msg)
    print(f"  [FAIL] {msg}")


def ok(msg: str) -> None:
    print(f"  [OK] {msg}")


def curl(method: str, url: str, headers: dict | None = None, body: str = "") -> tuple[int, str]:
    args = ["curl.exe", "-sL", "-X", method, "-w", "\n%{http_code}", url]
    for k, v in (headers or {}).items():
        args.extend(["-H", f"{k}: {v}"])
    if body:
        args.extend(["-d", body])
    r = subprocess.run(args, capture_output=True, text=True, encoding="utf-8", errors="replace")
    out = r.stdout or r.stderr or ""
    if "\n" in out:
        *lines, code = out.rsplit("\n", 1)
        return int(code.strip() or "0"), "\n".join(lines)
    return 0, out


def main() -> int:
    print(f"=== Billing smoke ({BASE}) ===\n")

    code, body = curl("GET", f"{BASE}/api/billing/status")
    if code != 200:
        fail(f"/api/billing/status HTTP {code}")
    else:
        try:
            data = json.loads(body)
            ok(f"billing status 200 — provider={data.get('provider')} configured={data.get('configured')}")
            if not data.get("configured"):
                fail("billing not configured on production")
        except json.JSONDecodeError:
            fail("billing status invalid JSON")

    # Empty POST — must not 500
    code, body = curl(
        "POST",
        f"{BASE}/api/billing/webhook",
        {"Content-Type": "application/json"},
        "{}",
    )
    if code >= 500:
        fail(f"webhook empty body HTTP {code} (server error)")
    elif code in (400, 401, 403, 422):
        ok(f"webhook empty body rejected with {code} (expected)")
    else:
        ok(f"webhook empty body HTTP {code}")

    # Bad Paddle signature — must reject
    code, _ = curl(
        "POST",
        f"{BASE}/api/billing/webhook",
        {"Content-Type": "application/json", "paddle-signature": "ts=1;h1=deadbeef"},
        '{"event_type":"transaction.completed","data":{"id":"smoke"}}',
    )
    if code >= 500:
        fail(f"webhook bad paddle sig HTTP {code}")
    elif code in (400, 401, 403):
        ok(f"webhook bad paddle signature rejected with {code}")
    else:
        fail(f"webhook bad paddle signature unexpected HTTP {code}")

    # Bad Stripe signature — skip when Stripe is not the active provider
    provider = None
    try:
        _, status_body = curl("GET", f"{BASE}/api/billing/status")
        provider = json.loads(status_body).get("provider")
    except Exception:
        pass

    if provider == "stripe":
        code, _ = curl(
            "POST",
            f"{BASE}/api/billing/webhook",
            {"Content-Type": "application/json", "stripe-signature": "t=1,v1=deadbeef"},
            '{"type":"checkout.session.completed","data":{"object":{}}}',
        )
        if code >= 500:
            fail(f"webhook bad stripe sig HTTP {code}")
        elif code in (400, 401, 403):
            ok(f"webhook bad stripe signature rejected with {code}")
        else:
            fail(f"webhook bad stripe signature unexpected HTTP {code}")
    else:
        code, _ = curl(
            "POST",
            f"{BASE}/api/billing/webhook",
            {"Content-Type": "application/json", "stripe-signature": "t=1,v1=deadbeef"},
            '{"type":"checkout.session.completed","data":{"object":{}}}',
        )
        if code == 503:
            ok(f"webhook stripe path returns 503 (inactive provider={provider or 'unknown'})")
        elif code in (400, 401, 403):
            ok(f"webhook bad stripe signature rejected with {code}")
        else:
            fail(f"webhook stripe path unexpected HTTP {code} when provider={provider}")

    print()
    if FAILURES:
        print(f"=== Result: FAIL ({len(FAILURES)} issue(s)) ===")
        return 1
    print("=== Result: PASS ===")
    print("\nNote: valid-signature Paddle/Stripe webhook + checkout session tests run on VPS only.")
    print("  python scripts/verify-webhook-vps.py   (requires DEPLOY_PASSWORD)")
    print("  node scripts/smoke-billing-on-vps.mjs  (on VPS)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
