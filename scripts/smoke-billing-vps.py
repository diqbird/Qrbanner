#!/usr/bin/env python3
"""Run smoke-billing-on-vps.mjs on the VPS (Stripe checkout session smoke)."""
import os
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

try:
    import paramiko
except ImportError:
    print("paramiko required")
    raise SystemExit(1)

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")


def main() -> int:
    if not PW:
        print("Set DEPLOY_PASSWORD")
        return 1

    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username=USER, password=PW, timeout=30)
    cmd = f"cd {REMOTE} && node scripts/smoke-billing-on-vps.mjs 2>&1"
    _, stdout, stderr = c.exec_command(cmd, timeout=120)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    c.close()
    print(out or err)

    if "OK checkout_url" in out:
        print("\n=== Result: PASS ===")
        return 0
    if "FAIL stripe_env" in out:
        print("\n=== Result: SKIP (Stripe not configured — Paddle is active provider) ===")
        return 0
    print("\n=== Result: FAIL ===")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
