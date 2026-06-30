#!/usr/bin/env python3
import os, paramiko
HOST, USER, PW = "31.97.113.170", "root", "112358Onrks.."
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"
FILES = [
    "components/qr/qr-quick-create.tsx",
    "components/qr/category-fields.tsx",
    "components/qr/qr-preview.tsx",
    "components/auth/verify-form.tsx",
    "components/auth/login-form.tsx",
    "components/auth/signup-form.tsx",
    "components/auth/reset-password-form.tsx",
    "components/auth/forgot-password-form.tsx",
    "components/dashboard/dashboard-content.tsx",
    "components/i18n/language-provider.tsx",
    "components/landing/hero-static.tsx",
    "app/(public)/page.tsx",
    "lib/qr-render.ts",
    "lib/scan-redirect-page.ts",
    "lib/i18n/fields.ts",
    "lib/i18n/server.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "app/s/[code]/route.ts",
]
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    sftp.put(os.path.join(LOCAL, rel), f"{REMOTE}/{rel.replace(chr(92), '/')}")
    print("ok", rel)
sftp.close()
_, o, _ = c.exec_command(f"cd {REMOTE} && yarn build > /tmp/qrb-backlog.log 2>&1; echo EXIT:$?; tail -8 /tmp/qrb-backlog.log", timeout=600)
out = o.read().decode("utf-8", errors="replace")
open(os.path.join(LOCAL, "scripts", "_deploy_out.txt"), "w", encoding="utf-8").write(out)
print(out)
c.exec_command("pm2 restart qrbanner", timeout=30)
c.close()
print("done")
