#!/usr/bin/env python3
"""Diagnose Top Countries analytics on VPS."""
import paramiko
import os

HOST = "31.97.113.170"
USER = "root"
PASSWORD = os.environ["DEPLOY_PASSWORD"]

cmds = [
    "cat /var/www/qrbanner/next.config.mjs 2>/dev/null || cat /var/www/qrbanner/next.config.js 2>/dev/null || echo NO_CONFIG",
    'cd /var/www/qrbanner && npx tsx -e "import { lookupGeo } from \'./lib/geoip\'; console.log(JSON.stringify(lookupGeo(\'78.189.183.89\')));"',
    "ls /var/www/qrbanner/.next/server/app/s/ 2>/dev/null | head -5",
    "grep -r geoip-lite /var/www/qrbanner/.next/server/app/s/ 2>/dev/null | head -3 || echo NO_GEOIP_IN_BUNDLE",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)
for cmd in cmds:
    print(">>>", cmd[:120])
    stdin, stdout, stderr = c.exec_command(cmd, timeout=90)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    print(out or err)
    print("---")
c.close()
