#!/usr/bin/env python3
"""List users and trigger forgot-password, then check logs."""
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
HOST = "31.97.113.170"
PW = os.environ.get("DEPLOY_PASSWORD", "112358Onrks..")
REMOTE = "/var/www/qrbanner"

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username="root", password=PW, timeout=30)

# List users matching onur
_, stdout, _ = c.exec_command(
    f"cd {REMOTE} && node -e \""
    "const {PrismaClient}=require('@prisma/client');"
    "const p=new PrismaClient();"
    "p.user.findMany({where:{email:{contains:'onur'}},select:{email:true,password:true,emailVerified:true},take:10})"
    ".then(u=>{console.log(JSON.stringify(u,null,2));return p.\\$disconnect();});"
    "\" 2>&1",
    timeout=30,
)
print("=== Users matching 'onur' ===")
print(stdout.read().decode("utf-8", "replace"))

# Trigger API
payload = json.dumps({"email": EMAIL}).encode("utf-8")
req = urllib.request.Request(
    "https://qrbanner.com/api/auth/forgot-password",
    data=payload,
    headers={"Content-Type": "application/json", "Origin": "https://qrbanner.com"},
    method="POST",
)
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        print(f"\nAPI {EMAIL}:", resp.status, resp.read().decode())
except urllib.error.HTTPError as e:
    print(f"\nAPI {EMAIL}:", e.code, e.read().decode())

# Check logs after trigger
_, stdout, _ = c.exec_command(
    "pm2 logs qrbanner --lines 30 --nostream 2>&1 | grep -iE 'email|forgot|reset|smtp|Password reset' | tail -10",
    timeout=30,
)
print("\n=== Logs after trigger ===")
print(stdout.read().decode("utf-8", "replace") or "(none)")

c.close()
