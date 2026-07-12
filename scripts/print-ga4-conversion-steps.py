#!/usr/bin/env python3
"""Print GA4 conversion setup steps using live VPS measurement IDs."""
from __future__ import annotations

import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from deploy_lib import DeployConfig, connect  # noqa: E402

EVENTS = [
    ("sign_up", "Email or OAuth registration (cookie consent required)"),
    ("first_qr_created", "User creates their first QR code"),
    ("generate_lead", "Sales / enterprise / procurement form submit"),
]


def read_env_key(content: str, key: str) -> str:
    m = re.search(rf'^{re.escape(key)}="?([^"\n]+)"?', content, re.MULTILINE)
    return m.group(1).strip() if m else ""


def main() -> int:
    cfg = DeployConfig()
    client, sftp = connect(cfg)
    with sftp.open(f"{cfg.remote}/.env", "r") as f:
        env = f.read().decode("utf-8", errors="replace")
    sftp.close()
    client.close()

    ga_id = read_env_key(env, "NEXT_PUBLIC_GA_MEASUREMENT_ID")
    gtm_id = read_env_key(env, "NEXT_PUBLIC_GTM_ID")

    print("=== GA4 conversion setup (manual, ~2 min) ===\n")
    if ga_id:
        print(f"Measurement ID: {ga_id}")
        print(f"Admin URL: https://analytics.google.com/analytics/web/#/p0/admin/events\n")
    if gtm_id:
        print(f"GTM container: {gtm_id}")
        print("(Custom events also push to dataLayer for GTM triggers.)\n")

    print("Steps:")
    print("1. GA4 Admin -> Data display -> Events")
    print("2. Wait for sign_up / first_qr_created after a test signup + first QR (with cookies accepted)")
    print("3. Toggle 'Mark as conversion' for each event\n")

    print("Events to mark:")
    for name, desc in EVENTS:
        print(f"  - {name}: {desc}")

    print("\nQuick test:")
    print("  - Accept cookies on qrbanner.com")
    print("  - Sign up -> check GA4 Realtime -> Events for sign_up")
    print("  - Create first QR -> check first_qr_created")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
