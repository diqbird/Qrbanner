#!/usr/bin/env python3
import os
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)

cmds = [
    f"grep PADDLE_WEBHOOK_SECRET {REMOTE}/.env || echo NO_SECRET_LINE",
    "pm2 logs qrbanner --lines 40 --nostream 2>&1 | grep -i webhook | tail -20 || echo NO_WEBHOOK_LOGS",
    'curl -s -o /dev/null -w "%{http_code}" -X POST https://qrbanner.com/api/billing/webhook -H "Content-Type: application/json" -d "{}"',
]
for cmd in cmds:
    _, stdout, stderr = c.exec_command(cmd, timeout=30)
    print(f"--- {cmd[:70]} ---")
    print(stdout.read().decode("utf-8", "replace"))
    err = stderr.read().decode("utf-8", "replace")
    if err.strip():
        print(err)
c.close()
