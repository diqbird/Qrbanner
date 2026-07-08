#!/usr/bin/env python3
"""Re-upload /pay page (Suspense fix), rebuild, restart."""
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
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"

FILES = ["app/(public)/pay/page.tsx"]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local = os.path.join(LOCAL, rel)
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    c.exec_command(f"mkdir -p '{os.path.dirname(remote)}'", timeout=30)
    sftp.put(local, remote)
    print("ok", rel)
sftp.close()

cmds = [
    f"cd {REMOTE} && yarn build 2>&1 | tail -20",
    "pm2 restart qrbanner 2>&1 | tail -3",
]
for cmd in cmds:
    print("\n>>>", cmd[:90])
    _, stdout, stderr = c.exec_command(cmd, timeout=900)
    print(stdout.read().decode("utf-8", errors="replace") or stderr.read().decode("utf-8", errors="replace"))

c.close()
print("\nPay fix deploy complete.")
