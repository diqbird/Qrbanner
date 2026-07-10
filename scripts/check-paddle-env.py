#!/usr/bin/env python3
"""Print Paddle env vars on the VPS and highlight missing keys."""
import os
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

REQUIRED = [
    "PADDLE_API_KEY",
    "PADDLE_CLIENT_TOKEN",
    "PADDLE_WEBHOOK_SECRET",
    "PADDLE_PRICE_PRO",
    "PADDLE_PRICE_BUSINESS",
    "PADDLE_PRICE_AGENCY",
    "PADDLE_PRICE_PRO_ANNUAL",
    "PADDLE_PRICE_BUSINESS_ANNUAL",
    "PADDLE_PRICE_AGENCY_ANNUAL",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
_, stdout, _ = c.exec_command(f"grep -E '^{'|'.join(REQUIRED)}=' {REMOTE}/.env", timeout=30)
text = stdout.read().decode("utf-8", "replace")
print(text)

present = set()
for line in text.splitlines():
    if "=" in line:
        present.add(line.split("=", 1)[0].strip())

missing = [k for k in REQUIRED if k not in present]
if missing:
    print("\nMISSING:")
    for key in missing:
        print(f"  - {key}")
else:
    print("\nAll required Paddle keys are present.")
c.close()
