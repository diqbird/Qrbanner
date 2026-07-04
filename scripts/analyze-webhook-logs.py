#!/usr/bin/env python3
"""Analyze production webhook logs on VPS — Paddle/Stripe delivery health."""
import os
import re
import sys
from collections import Counter
from datetime import datetime, timezone

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

try:
    import paramiko
except ImportError:
    print("paramiko required: pip install paramiko")
    raise SystemExit(1)

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD", "112358Onrks..")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")
APP = os.environ.get("PM2_APP", "qrbanner")
LINES = int(os.environ.get("WEBHOOK_LOG_LINES", "500"))

FAILURES: list[str] = []


def main() -> int:
    print(f"=== Webhook log analysis ({HOST}) ===\n")

    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username=USER, password=PW, timeout=30)

    cmds = [
        f"grep PADDLE_WEBHOOK {REMOTE}/.env 2>/dev/null | head -3 | sed 's/=.*/=***/' || echo NO_PADDLE",
        f"grep STRIPE_WEBHOOK {REMOTE}/.env 2>/dev/null | head -3 | sed 's/=.*/=***/' || echo NO_STRIPE",
        f"pm2 logs {APP} --lines {LINES} --nostream 2>&1",
    ]

    webhook_lines: list[str] = []
    env_lines: list[str] = []

    for i, cmd in enumerate(cmds):
        _, stdout, stderr = c.exec_command(cmd, timeout=60)
        out = (stdout.read() or b"").decode("utf-8", errors="replace")
        err = (stderr.read() or b"").decode("utf-8", errors="replace")
        text = out + err
        if i < 2:
            env_lines.extend(text.splitlines())
        else:
            webhook_lines.extend(text.splitlines())

    c.close()

    print("--- Billing webhook config ---")
    for ln in env_lines:
        if ln.strip():
            print(f"  {ln.strip()}")

    hits = [ln for ln in webhook_lines if re.search(r"webhook|paddle|stripe|billing", ln, re.I)]
    print(f"\n--- Webhook-related log lines (last {LINES} PM2 lines, {len(hits)} hits) ---")

    status_counter: Counter[str] = Counter()
    error_samples: list[str] = []

    for ln in hits[-40:]:
        print(f"  {ln.rstrip()[:160]}")
        m = re.search(r"\b(200|201|400|401|403|404|422|500|502)\b", ln)
        if m:
            status_counter[m.group(1)] += 1
        if re.search(r"error|fail|invalid|reject|signature", ln, re.I):
            error_samples.append(ln.strip()[:200])

    print("\n--- Summary ---")
    if status_counter:
        print(f"  HTTP status mentions: {dict(status_counter)}")
    else:
        print("  No HTTP status codes in webhook log hits (may be quiet period)")

    sig_ok = sum(1 for ln in hits if re.search(r"signature.*valid|webhook.*verified|200", ln, re.I))
    sig_bad = sum(1 for ln in hits if re.search(r"invalid.*signature|signature.*fail|400", ln, re.I))
    print(f"  Likely valid deliveries: {sig_ok}")
    print(f"  Likely rejected (bad sig): {sig_bad}")

    if error_samples:
        print(f"\n  Recent errors/warnings ({min(5, len(error_samples))} shown):")
        for ln in error_samples[-5:]:
            print(f"    • {ln}")

    # Live probe — unsigned POST should 400
    import urllib.error
    import urllib.request

    probe_url = "https://qrbanner.com/api/billing/webhook"
    try:
        req = urllib.request.Request(
            probe_url,
            data=b"{}",
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            code = resp.status
        print(f"\n  Live probe (empty body): HTTP {code}")
        if code not in (400, 401, 403):
            FAILURES.append(f"unsigned webhook probe returned {code}, expected 4xx")
    except urllib.error.HTTPError as e:
        print(f"\n  Live probe (empty body): HTTP {e.code} (expected 4xx)")
        if e.code not in (400, 401, 403, 422):
            FAILURES.append(f"unsigned webhook probe returned {e.code}")

    print()
    if FAILURES:
        print(f"=== Result: FAIL ({len(FAILURES)} issue(s)) ===")
        for f in FAILURES:
            print(f"  • {f}")
        return 1

    print("=== Result: PASS ===")
    print(f"  Analyzed at {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
