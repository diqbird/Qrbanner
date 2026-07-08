#!/usr/bin/env python3
import os, paramiko, json
HOST, USER, PW = "31.97.113.170", "root", os.environ["DEPLOY_PASSWORD"]
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"
c = paramiko.SSHClient(); c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
sftp.put(os.path.join(LOCAL, "scripts", "scan-qr-urls.js"), f"{REMOTE}/scripts/scan-qr-urls.js")
sftp.close()
_, o, e = c.exec_command(f"cd {REMOTE} && node scripts/scan-qr-urls.js", timeout=120)
out = o.read().decode("utf-8", errors="replace")
err = e.read().decode("utf-8", errors="replace")
c.close()
print(out or err)
open(os.path.join(LOCAL, "security-scan.json"), "w", encoding="utf-8").write(out or err)
