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
_, stdout, _ = c.exec_command(
    f"grep -E '^SMTP_' {REMOTE}/.env | while IFS='=' read -r k v; do "
    f"if [ \"$k\" = SMTP_PASSWORD ]; then echo SMTP_PASSWORD len=${{#v}}; "
    f"else echo \"$k=$v\"; fi; done",
    timeout=30,
)
print(stdout.read().decode("utf-8", "replace"))
c.close()
