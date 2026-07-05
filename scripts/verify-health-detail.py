#!/usr/bin/env python3
"""Verify /api/health public vs detailed responses without printing secrets."""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(__file__))
from deploy_lib import DeployConfig, connect  # noqa: E402

BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")


def fetch_health(headers: dict[str, str] | None = None) -> dict:
    req = urllib.request.Request(f"{BASE}/api/health", headers=headers or {})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def read_env_key(content: str, key: str) -> str:
    m = re.search(rf'^{re.escape(key)}="?([^"\n]+)"?', content, re.MULTILINE)
    return m.group(1).strip() if m else ""


def main() -> int:
    public = fetch_health()
    ok_public = public.get("ok") is True and "checks" not in public
    print(f"public health: ok={public.get('ok')} checks_absent={ok_public}")

    cfg = DeployConfig()
    client, sftp = connect(cfg)
    with sftp.open(f"{cfg.remote}/.env", "r") as f:
        secret = read_env_key(f.read().decode("utf-8", errors="replace"), "HEALTH_DETAIL_SECRET")
    sftp.close()
    client.close()

    if not secret:
        print("FAIL: HEALTH_DETAIL_SECRET not set on VPS")
        return 1

    detailed = fetch_health({"Authorization": f"Bearer {secret}"})
    ok_detail = detailed.get("ok") is True and isinstance(detailed.get("checks"), dict)
    print(f"detailed health: ok={detailed.get('ok')} checks_present={ok_detail}")

    wrong = fetch_health({"Authorization": "Bearer wrong-secret"})
    ok_wrong = "checks" not in wrong
    print(f"wrong bearer: checks_absent={ok_wrong}")

    passed = ok_public and ok_detail and ok_wrong
    print("PASS" if passed else "FAIL")
    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
