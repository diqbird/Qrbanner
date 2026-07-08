#!/usr/bin/env python3
"""Quick VPS status: pm2, recent logs, SMTP env presence."""
import os
import sys
import paramiko

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HOST = "31.97.113.170"
USER = "root"
PW = os.environ.get("DEPLOY_PASSWORD", "")
REMOTE = "/var/www/qrbanner"

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)

cmds = [
    "pm2 status qrbanner",
    "pm2 logs qrbanner --lines 5 --nostream 2>&1 | tail -10",
    f"grep -E '^SMTP_' {REMOTE}/.env | sed -E 's/(SMTP_PASSWORD=).*/\\1***MASKED***/'",
    f"test -f {REMOTE}/.next/BUILD_ID && echo BUILD_ID=$(cat {REMOTE}/.next/BUILD_ID)",
]

for cmd in cmds:
    print(">>>", cmd[:70])
    _, stdout, stderr = c.exec_command(cmd, timeout=30)
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    print(out or err or "(empty)")
    print()

c.close()
