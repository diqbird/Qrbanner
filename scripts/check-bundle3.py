#!/usr/bin/env python3
import paramiko

HOST = "31.97.113.170"
USER = "root"
PASSWORD = "112358Onrks.."

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)
stdin, stdout, stderr = c.exec_command(
    "cat '/var/www/qrbanner/.next/server/app/s/[code]/route.js'",
    timeout=90,
)
content = stdout.read().decode("utf-8", errors="replace")
idx = content.find("47738:")
print(content[idx : idx + 1500])
c.close()
