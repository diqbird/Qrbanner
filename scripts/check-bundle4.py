#!/usr/bin/env python3
import paramiko, re
import os

HOST = "31.97.113.170"
USER = "root"
PASSWORD = os.environ["DEPLOY_PASSWORD"]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)
stdin, stdout, stderr = c.exec_command(
    "cat '/var/www/qrbanner/.next/server/app/s/[code]/route.js'",
    timeout=90,
)
content = stdout.read().decode("utf-8", errors="replace")
m = re.search(r"20555:(e,t,r)=>{[^}]{0,500}", content)
if m:
    print("MODULE 20555 start:", m.group(0)[:500])
idx = content.find("20555:")
print(content[idx : idx + 800])
c.close()
