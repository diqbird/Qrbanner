#!/usr/bin/env python3
import os
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

keys = [
    "PADDLE_CLIENT_TOKEN",
    "PADDLE_PRICE_PRO_ANNUAL",
    "PADDLE_PRICE_BUSINESS_ANNUAL",
    "PADDLE_PRICE_AGENCY_ANNUAL",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
_, stdout, _ = c.exec_command(f"grep -E '{'|'.join(keys)}' {REMOTE}/.env", timeout=30)
print(stdout.read().decode("utf-8", "replace"))
c.close()
