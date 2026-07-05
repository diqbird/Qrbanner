#!/usr/bin/env python3
"""Deploy mail address alignment (support@ + noreply@)."""
import os
import sys
import paramiko

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HOST = "31.97.113.170"
USER = "root"
PW = os.environ.get("DEPLOY_PASSWORD", "112358Onrks..")
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"

FILES = [
    "lib/site-contact.ts",
    "lib/email.ts",
    "app/(public)/contact/page.tsx",
    "app/(public)/privacy/page.tsx",
    "app/(public)/terms/page.tsx",
    "app/(public)/cookies/page.tsx",
    "app/(public)/refund/page.tsx",
    "scripts/upgrade-dmarc-guide.py",
    "scripts/verify-dmarc-policy.py",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    sftp.put(os.path.join(LOCAL, rel), f"{REMOTE}/{rel}")
    print("ok", rel)
sftp.close()

_, stdout, _ = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -8", timeout=900)
print(stdout.read().decode("utf-8", errors="replace"))
_, stdout, _ = c.exec_command("pm2 restart qrbanner 2>&1 | tail -2", timeout=60)
print(stdout.read().decode("utf-8", errors="replace"))
c.close()
print("Mail config deployed.")
