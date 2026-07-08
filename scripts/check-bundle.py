#!/usr/bin/env python3
import paramiko
import os

HOST = "31.97.113.170"
USER = "root"
PASSWORD = os.environ["DEPLOY_PASSWORD"]

cmds = [
    "find /var/www/qrbanner/.next/server -name '*route*' -path '*s/*code*' 2>/dev/null | head -5",
    "grep -l 'lookupGeo\\|geoip' /var/www/qrbanner/.next/server/app/s/\\[code\\]/route.js 2>/dev/null; wc -c /var/www/qrbanner/.next/server/app/s/\\[code\\]/route.js 2>/dev/null",
    "grep -o 'geoip[^\"]*' /var/www/qrbanner/.next/server/app/s/\\[code\\]/route.js 2>/dev/null | head -10 || echo NO_MATCH",
    """cd /var/www/qrbanner && node --input-type=module -e "
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const route = '/var/www/qrbanner/.next/server/app/s/[code]/route.js';
try {
  const g = require('geoip-lite');
  console.log('direct', g.lookup('78.189.183.89'));
} catch(e) { console.log('direct err', e.message); }
" """,
    "ls /var/www/qrbanner/.next/server/chunks/ | grep -i geo | head -5 || echo no_geo_chunk",
    "grep -r 'geoip-lite' /var/www/qrbanner/.next/server/chunks/ 2>/dev/null | head -5 || echo no_refs",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)
for cmd in cmds:
    print(">>>", cmd[:100].replace("\n", " "))
    stdin, stdout, stderr = c.exec_command(cmd, timeout=90)
    print((stdout.read() + stderr.read()).decode("utf-8", errors="replace")[:2000])
    print("---")
c.close()
