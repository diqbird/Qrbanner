#!/usr/bin/env python3
import paramiko

HOST = "31.97.113.170"
USER = "root"
PASSWORD = "112358Onrks.."

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)
stdin, stdout, stderr = c.exec_command(
    "grep -r '20555:' /var/www/qrbanner/.next/server/ 2>/dev/null | head -5",
    timeout=90,
)
print(stdout.read().decode("utf-8", errors="replace"))
stdin, stdout, stderr = c.exec_command(
    "grep -rl 'geoip-lite' /var/www/qrbanner/.next/server/ 2>/dev/null | head -10",
    timeout=90,
)
print("files with geoip-lite:", stdout.read().decode())
c.close()
