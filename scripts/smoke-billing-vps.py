#!/usr/bin/env python3
"""Run Paddle billing smoke on the VPS (env + local /api/billing/status)."""
import os
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

sys.path.insert(0, os.path.dirname(__file__))
from deploy_lib import DeployConfig, connect, run_ssh  # noqa: E402


def main() -> int:
    cfg = DeployConfig()
    client, _sftp = connect(cfg)
    cmd = f"cd {cfg.remote} && node scripts/smoke-billing-on-vps.mjs 2>&1"
    out, exit_code = run_ssh(client, cmd, timeout=120)
    client.close()
    print(out)

    if ("OK billing_status" in out or "OK paddle_env" in out) and exit_code == 0:
        print("\n=== Result: PASS ===")
        return 0
    if "FAIL paddle_api_key" in out or "FAIL paddle_price_pro" in out:
        print("\n=== Result: FAIL (Paddle env missing on VPS) ===")
        return 1
    print("\n=== Result: FAIL ===")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
