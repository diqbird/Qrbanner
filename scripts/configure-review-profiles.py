#!/usr/bin/env python3
"""Set G2/Capterra review URLs on VPS .env and rebuild.

Example:
  python scripts/configure-review-profiles.py \\
    --g2-url https://www.g2.com/products/qrbanner/reviews \\
    --capterra-url https://www.capterra.com/p/qrbanner/reviews
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(__file__))


def main() -> int:
    parser = argparse.ArgumentParser(description="Configure review profile URLs on VPS")
    parser.add_argument("--g2-url", help="NEXT_PUBLIC_G2_REVIEW_URL")
    parser.add_argument("--capterra-url", help="NEXT_PUBLIC_CAPTERRA_REVIEW_URL")
    parser.add_argument("--no-rebuild", action="store_true")
    args = parser.parse_args()

    if not args.g2_url and not args.capterra_url:
        parser.error("Provide at least one of --g2-url or --capterra-url")

    pairs: list[str] = []
    if args.g2_url:
        pairs.append(f"NEXT_PUBLIC_G2_REVIEW_URL={args.g2_url}")
    if args.capterra_url:
        pairs.append(f"NEXT_PUBLIC_CAPTERRA_REVIEW_URL={args.capterra_url}")

    cmd = [sys.executable, os.path.join(os.path.dirname(__file__), "set-vps-env.py"), *pairs]
    rc = subprocess.call(cmd)
    if rc != 0:
        return rc

    if args.no_rebuild:
        print("Skipping rebuild (--no-rebuild). Run deploy with build:true to apply NEXT_PUBLIC_* vars.")
        return 0

    manifest = os.path.join(os.path.dirname(__file__), "manifests", "customer-ux-pack12-review-profiles.json")
    deploy = os.path.join(os.path.dirname(__file__), "deploy.py")
    return subprocess.call([sys.executable, deploy, "--manifest", manifest])


if __name__ == "__main__":
    raise SystemExit(main())
