#!/usr/bin/env python3
"""Print Etsy webhook connection details for automation tools."""
from __future__ import annotations

import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from deploy_lib import DeployConfig, connect  # noqa: E402

BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")


def read_env_key(content: str, key: str) -> str:
    m = re.search(rf'^{re.escape(key)}="?([^"\n]+)"?', content, re.MULTILINE)
    return m.group(1).strip() if m else ""


def main() -> int:
    cfg = DeployConfig()
    client, sftp = connect(cfg)
    with sftp.open(f"{cfg.remote}/.env", "r") as f:
        secret = read_env_key(f.read().decode("utf-8", errors="replace"), "ETSY_WEBHOOK_SECRET")
    sftp.close()
    client.close()

    if not secret:
        print("ETSY_WEBHOOK_SECRET is not set. Run: python scripts/set-vps-env.py --generate-etsy-secret")
        return 1

    print("=== Etsy Premium Studio webhook ===\n")
    print(f"URL: POST {BASE}/api/webhooks/etsy")
    print("Header: Authorization: Bearer <ETSY_WEBHOOK_SECRET>")
    print(f"Secret ({len(secret)} chars): {secret[:4]}...{secret[-4:]}")
    print("\nExample JSON body:")
    print('  {"buyerEmail":"buyer@example.com","externalOrderId":"etsy-12345","notes":"locale:tr"}')
    print("\nVerify: python scripts/test-etsy-webhook.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
