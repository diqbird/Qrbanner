#!/usr/bin/env python3
"""Bootstrap optional VPS ops secrets and verify health checks."""
from __future__ import annotations

import argparse
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def run(script: str, *args: str) -> int:
    cmd = [sys.executable, os.path.join(ROOT, "scripts", script), *args]
    print(f"\n>>> {' '.join(cmd)}")
    return subprocess.call(cmd)


def main() -> int:
    parser = argparse.ArgumentParser(description="Bootstrap VPS ops env and verify health")
    parser.add_argument("--skip-etsy", action="store_true", help="Do not generate ETSY_WEBHOOK_SECRET")
    parser.add_argument("--skip-health", action="store_true", help="Do not generate HEALTH_DETAIL_SECRET")
    args = parser.parse_args()

    code = 0
    if not args.skip_health:
        code |= run("set-vps-env.py", "--generate-health-secret")
    if not args.skip_etsy:
        code |= run("set-vps-env.py", "--generate-etsy-secret")
    code |= run("verify-health-detail.py")
    code |= run("check-paddle-env.py")
    return 1 if code else 0


if __name__ == "__main__":
    raise SystemExit(main())
