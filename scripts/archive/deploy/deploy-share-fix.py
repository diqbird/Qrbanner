#!/usr/bin/env python3
import os, paramiko
HOST, USER, PW = "31.97.113.170", "root", "112358Onrks.."
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"
FILES = [
    "components/qr/qr-preview.tsx",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "scripts/test-share-logic.mjs",
]
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    sftp.put(os.path.join(LOCAL, rel), f"{REMOTE}/{rel.replace(chr(92), '/')}")
    print("ok", rel)
sftp.close()
_, o, _ = c.exec_command(f"cd {REMOTE} && node scripts/test-share-logic.mjs && yarn build > /tmp/qrb-share.log 2>&1; echo EXIT:$?; tail -5 /tmp/qrb-share.log", timeout=600)
out = o.read().decode("utf-8", errors="replace")
with open(os.path.join(LOCAL, "scripts", "_deploy_out.txt"), "w", encoding="utf-8") as f:
    f.write(out)
print(out)
c.exec_command("pm2 restart qrbanner", timeout=30)
c.close()
print("done")
