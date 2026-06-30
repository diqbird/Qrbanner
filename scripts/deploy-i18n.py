#!/usr/bin/env python3
import os, paramiko, time
HOST, USER, PW = "31.97.113.170", "root", "112358Onrks.."
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"
FILES = [
    "lib/i18n/types.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "lib/i18n/index.ts",
    "components/i18n/language-provider.tsx",
    "components/i18n/language-switcher.tsx",
    "components/providers.tsx",
    "components/public-header.tsx",
    "components/public-footer.tsx",
    "components/landing/hero.tsx",
    "components/auth/oauth-buttons.tsx",
    "components/auth/login-form.tsx",
    "components/auth/signup-form.tsx",
    "components/auth/forgot-password-form.tsx",
    "components/auth/reset-password-form.tsx",
    "components/auth/password-strength-meter.tsx",
    "components/dashboard/dashboard-shell.tsx",
    "components/dashboard/dashboard-content.tsx",
    "components/dashboard/onboarding-banner.tsx",
    "components/dashboard/settings-content.tsx",
    "components/qr/qr-create-wizard.tsx",
]
c = paramiko.SSHClient(); c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    c.exec_command(f"mkdir -p '{os.path.dirname(remote)}'", timeout=30)
    sftp.put(os.path.join(LOCAL, rel), remote)
    print("ok", rel)
sftp.close()
o = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -12", timeout=900)[1].read().decode("ascii", errors="replace")
open(os.path.join(LOCAL, "build-out.txt"), "w", encoding="utf-8").write(o)
if "Failed to compile" in o: raise SystemExit(1)
c.exec_command("pm2 restart qrbanner", timeout=60)
c.close()
print("DONE")
