#!/usr/bin/env python3
import os, paramiko
HOST, USER, PW = "31.97.113.170", "root", os.environ["DEPLOY_PASSWORD"]
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"
FILES = [
    "components/qr/frame-label-settings.tsx",
    "components/qr/qr-style-editor.tsx",
    "components/qr/qr-preview.tsx",
    "components/qr/qr-create-wizard.tsx",
    "components/qr/qr-edit-view.tsx",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
]
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    sftp.put(os.path.join(LOCAL, rel), f"{REMOTE}/{rel.replace(chr(92), '/')}")
    print("ok", rel)
sftp.close()
_, o, _ = c.exec_command(f"cd {REMOTE} && yarn build > /tmp/qrb.log 2>&1; echo EXIT:$?; tail -8 /tmp/qrb.log", timeout=600)
with open(os.path.join(LOCAL, "scripts", "_deploy_out.txt"), "w", encoding="utf-8") as f:
    f.write(o.read().decode("utf-8", errors="replace"))
c.exec_command("pm2 restart qrbanner", timeout=30)
c.close()
print("done")
