#!/usr/bin/env python3
"""Deploy code-based (OTP) password reset flow: upload files, rebuild, restart."""
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

FILES = [
    "lib/password-reset.ts",
    "lib/email.ts",
    "app/api/auth/forgot-password/route.ts",
    "app/api/auth/reset-password/route.ts",
    "components/auth/forgot-password-form.tsx",
    "components/auth/reset-password-form.tsx",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
]

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
    f"cd {REMOTE} && yarn build 2>&1 | tail -25",
    "pm2 restart qrbanner 2>&1 | tail -3",
]
for cmd in cmds:
    print("\n>>>", cmd[:90])
    _, stdout, stderr = c.exec_command(cmd, timeout=900)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    print(out or err)

c.close()
print("\nReset-code deploy complete.")
