#!/usr/bin/env python3
"""Smoke-test Etsy webhook on production without printing secrets."""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request

sys.path.insert(0, os.path.dirname(__file__))
from deploy_lib import DeployConfig, connect  # noqa: E402

BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")
TEST_EMAIL = os.environ.get("ETSY_TEST_EMAIL", "qa-etsy-webhook@qrbanner.com")


def read_env_key(content: str, key: str) -> str:
    m = re.search(rf'^{re.escape(key)}="?([^"\n]+)"?', content, re.MULTILINE)
    return m.group(1).strip() if m else ""


def post_etsy(payload: dict, secret: str | None = None) -> tuple[int, dict]:
    headers = {"Content-Type": "application/json"}
    if secret:
        headers["Authorization"] = f"Bearer {secret}"
    req = urllib.request.Request(
        f"{BASE}/api/webhooks/etsy",
        data=json.dumps(payload).encode(),
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as err:
        body = err.read().decode()
        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            data = {"raw": body[:200]}
        return err.code, data


def main() -> int:
    print("1) unauthorized (no bearer)")
    code, body = post_etsy({"buyerEmail": TEST_EMAIL, "externalOrderId": "qa-smoke-unauth"})
    print(f"   status={code} error={body.get('error')}")
    if code != 401:
        print("FAIL: expected 401")
        return 1

    cfg = DeployConfig()
    client, sftp = connect(cfg)
    with sftp.open(f"{cfg.remote}/.env", "r") as f:
        secret = read_env_key(f.read().decode("utf-8", errors="replace"), "ETSY_WEBHOOK_SECRET")
    sftp.close()
    client.close()

    if not secret:
        print("FAIL: ETSY_WEBHOOK_SECRET not set on VPS")
        return 1

    order_id = "qa-smoke-auth-001"
    print("2) authorized create")
    code, body = post_etsy(
        {"buyerEmail": TEST_EMAIL, "externalOrderId": order_id, "notes": "locale:tr qa smoke"},
        secret,
    )
    print(f"   status={code} ok={body.get('ok')} created={body.get('created')} id={body.get('id')}")
    if code != 200 or not body.get("ok"):
        print("FAIL: authorized webhook rejected")
        return 1

    print("3) authorized idempotent replay")
    code2, body2 = post_etsy(
        {"buyerEmail": TEST_EMAIL, "externalOrderId": order_id},
        secret,
    )
    print(f"   status={code2} ok={body2.get('ok')} created={body2.get('created')}")
    if code2 != 200 or body2.get("created") is True:
        print("FAIL: duplicate should not create again")
        return 1

    print("PASS: Etsy webhook production smoke")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
