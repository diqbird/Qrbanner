#!/usr/bin/env python3
import paramiko
import os
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password=os.environ["DEPLOY_PASSWORD"], timeout=30)
for url in [
    "https://qrbanner.com/",
    "https://qrbanner.com/sitemap.xml",
    "https://qrbanner.com/robots.txt",
    "https://qrbanner.com/qr/create",
    "https://qrbanner.com/signup",
]:
    cmd = f"curl -sI {url} | head -1"
    o = c.exec_command(cmd, timeout=30)[1].read().decode().strip()
    print(url, "->", o)
o = c.exec_command("pm2 status qrbanner | tail -3", timeout=30)[1].read().decode()
print("PM2:", o.strip())
c.close()
