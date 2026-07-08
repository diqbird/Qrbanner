#!/usr/bin/env python3
"""Deploy public API rate limits (landing-cta, scan/geo, referral/lookup)."""
import os
import sys
import paramiko

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HOST = "31.97.113.170"
USER = "root"
PW = os.environ.get("DEPLOY_PASSWORD", "")
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"

FILES = [
    "app/api/landing-cta/route.ts",
    "app/api/scan/geo/route.ts",
    "app/api/referral/lookup/route.ts",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    sftp.put(os.path.join(LOCAL, rel), f"{REMOTE}/{rel}")
    print("ok", rel)
sftp.close()

_, stdout, stderr = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -12", timeout=900)
out = stdout.read().decode("utf-8", errors="replace")
print(out)
err = stderr.read().decode("utf-8", errors="replace")
if err.strip():
    print("stderr:", err[-800:])
_, stdout, _ = c.exec_command("pm2 restart qrbanner 2>&1 | tail -2", timeout=60)
print(stdout.read().decode("utf-8", errors="replace"))
c.close()
print("API rate limits deployed.")
