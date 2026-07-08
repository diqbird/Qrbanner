#!/usr/bin/env python3
import paramiko, time
import os
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password=os.environ["DEPLOY_PASSWORD"], timeout=30)
o = c.exec_command("cd /var/www/qrbanner && yarn build 2>&1 | tail -8", timeout=900)[1].read().decode("ascii", errors="replace")
print("BUILD:", o)
if "Failed to compile" not in o and "error Command failed" not in o:
    c.exec_command("pm2 restart qrbanner", timeout=60)
    time.sleep(4)
o2 = c.exec_command("curl -s https://qrbanner.com/api/auth/providers", timeout=30)[1].read().decode()
print("PROVIDERS:", o2)
c.close()
