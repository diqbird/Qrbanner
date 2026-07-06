#!/usr/bin/env python3
"""Check G2/Capterra review URL env on VPS and optional HTTP reachability."""
from __future__ import annotations

import os
import re
import sys
import urllib.error
import urllib.request

sys.path.insert(0, os.path.dirname(__file__))
from deploy_lib import DeployConfig, connect  # noqa: E402

KEYS = ("NEXT_PUBLIC_G2_REVIEW_URL", "NEXT_PUBLIC_CAPTERRA_REVIEW_URL")


def read_env_key(content: str, key: str) -> str:
    m = re.search(rf'^{re.escape(key)}="?([^"\n]+)"?', content, re.MULTILINE)
    return m.group(1).strip() if m else ""


def head_ok(url: str) -> bool:
    if not url:
        return False
    try:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "QRbanner-verify/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            return 200 <= resp.status < 400
    except urllib.error.HTTPError as e:
        return 200 <= e.code < 400
    except Exception:
        return False


def main() -> int:
    cfg = DeployConfig()
    client, sftp = connect(cfg)
    with sftp.open(f"{cfg.remote}/.env", "r") as f:
        content = f.read().decode("utf-8", errors="replace")
    sftp.close()
    client.close()

    ok = True
    for key in KEYS:
        val = read_env_key(content, key)
        if not val:
            print(f"MISSING {key}")
            ok = False
            continue
        reachable = head_ok(val)
        status = "OK" if reachable else "WARN (URL set but not reachable)"
        print(f"{status} {key}={val}")
        if not reachable:
            ok = False

    if ok:
        print("Review profile env: ready")
        return 0
    print("Review profile env: not ready — claim G2/Capterra profiles, then:")
    print("  python scripts/configure-review-profiles.py --g2-url URL --capterra-url URL")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
