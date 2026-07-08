#!/usr/bin/env python3
import os, paramiko
HOST, USER, PW = "31.97.113.170", "root", os.environ["DEPLOY_PASSWORD"]
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"
FILES = ["app/layout.tsx", "components/analytics/site-google-analytics.tsx"]
c = paramiko.SSHClient(); c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    c.exec_command(f"mkdir -p '{os.path.dirname(remote)}'", timeout=30)
    sftp.put(os.path.join(LOCAL, rel), remote)
    print("ok", rel)
sftp.close()
o = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -6", timeout=900)[1].read().decode("ascii", errors="replace")
print(o.encode("ascii", errors="replace").decode("ascii"))
c.exec_command("pm2 restart qrbanner", timeout=60)
c.close()
print("DONE")
