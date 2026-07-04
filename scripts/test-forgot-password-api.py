#!/usr/bin/env python3
"""Test live forgot-password API and check Turnstile env on VPS."""
import json
import os
import sys
import urllib.request

import paramiko

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

EMAIL = sys.argv[1] if len(sys.argv) > 1 else "onur@admin.com"

# Live API test
payload = json.dumps({"email": EMAIL}).encode("utf-8")
req = urllib.request.Request(
    "https://qrbanner.com/api/auth/forgot-password",
    data=payload,
    headers={
        "Content-Type": "application/json",
        "Origin": "https://qrbanner.com",
    },
    method="POST",
)
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode("utf-8")
        print("API_STATUS:", resp.status)
        print("API_BODY:", body)
except urllib.error.HTTPError as e:
    print("API_STATUS:", e.code)
    print("API_BODY:", e.read().decode("utf-8", errors="replace"))

# VPS env check
HOST = "31.97.113.170"
PW = os.environ.get("DEPLOY_PASSWORD", "112358Onrks..")
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username="root", password=PW, timeout=30)
_, stdout, _ = c.exec_command(
    "grep -E '^(TURNSTILE_|NEXT_PUBLIC_TURNSTILE)' /var/www/qrbanner/.env | sed 's/=.*/=***/'",
    timeout=30,
)
print("\nTURNSTILE_ENV:")
print(stdout.read().decode("utf-8", "replace") or "(not set)")

_, stdout, _ = c.exec_command(
    "pm2 logs qrbanner --lines 15 --nostream 2>&1 | tail -15",
    timeout=30,
)
print("\nRECENT_LOGS:")
print(stdout.read().decode("utf-8", "replace"))
c.close()
