#!/usr/bin/env python3
import os, paramiko
HOST, USER, PW = "31.97.113.170", "root", os.environ["DEPLOY_PASSWORD"]
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"
FILES = [
    "components/landing/hero.tsx",
    "components/public-header.tsx",
    "components/public-footer.tsx",
    "components/qr/qr-quick-create.tsx",
    "components/qr/link-hub-editor.tsx",
    "components/qr/qr-create-wizard.tsx",
    "components/qr/qr-preview.tsx",
    "components/qr/qr-style-editor.tsx",
    "lib/landing-page.ts",
    "lib/qr-utils.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "app/sitemap.ts",
    "app/(public)/about/page.tsx",
    "app/(public)/contact/page.tsx",
]
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    remote_dir = os.path.dirname(remote).replace("\\", "/")
    c.exec_command(f"mkdir -p '{remote_dir}'", timeout=10)
    sftp.put(os.path.join(LOCAL, rel), remote)
    print("ok", rel)
sftp.close()
_, o, _ = c.exec_command(f"cd {REMOTE} && yarn build > /tmp/qrb-gap.log 2>&1; echo EXIT:$?; tail -8 /tmp/qrb-gap.log", timeout=600)
with open(os.path.join(LOCAL, "scripts", "_deploy_out.txt"), "w", encoding="utf-8") as f:
    f.write(o.read().decode("utf-8", errors="replace"))
c.exec_command("pm2 restart qrbanner", timeout=30)
c.close()
print("done")
