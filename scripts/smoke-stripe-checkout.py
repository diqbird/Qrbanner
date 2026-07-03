#!/usr/bin/env python3
"""Run live Pro checkout smoke test on VPS."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")

if not PW:
    print("ERROR: Set DEPLOY_PASSWORD", file=sys.stderr)
    sys.exit(1)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)

sftp = c.open_sftp()
sftp.put(os.path.join(LOCAL, "scripts", "smoke-billing-on-vps.mjs"), f"{REMOTE}/scripts/smoke-billing-on-vps.mjs")
sftp.close()

cmds = [
    f"cd {REMOTE} && node scripts/smoke-billing-on-vps.mjs",
    "curl -s -o /dev/null -w 'webhook_status:%{http_code}' -X POST https://qrbanner.com/api/billing/webhook",
    "curl -s -o /dev/null -w 'pricing_status:%{http_code}' https://qrbanner.com/pricing",
]

for cmd in cmds:
    _, stdout, stderr = c.exec_command(cmd, timeout=120)
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if out:
        print(out)
    if err and "npm warn" not in err.lower():
        print(err, file=sys.stderr)

c.close()
