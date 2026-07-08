#!/usr/bin/env python3
"""Deploy login fixes to production."""
import os
import paramiko
import time

HOST = "31.97.113.170"
USER = "root"
PASSWORD = os.environ["DEPLOY_PASSWORD"]
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"

FILES = [
    "lib/auth-providers.ts",
    "lib/auth-options.ts",
    "components/auth/login-form.tsx",
    "app/(auth)/login/page.tsx",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local = os.path.join(LOCAL, rel)
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    remote_dir = os.path.dirname(remote)
    c.exec_command(f"mkdir -p '{remote_dir}'", timeout=30)
    sftp.put(local, remote)
    print("ok", rel)
sftp.close()

o = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -20", timeout=900)[1].read().decode("utf-8", errors="replace")
print(o)
if "Failed to compile" in o:
    c.close()
    raise SystemExit(1)

c.exec_command("pm2 restart qrbanner", timeout=60)
time.sleep(4)
print(c.exec_command("curl -sI https://qrbanner.com/login | head -1", timeout=30)[1].read().decode())
c.close()
print("DONE")
