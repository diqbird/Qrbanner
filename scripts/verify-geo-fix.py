#!/usr/bin/env python3
import paramiko

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password="112358Onrks..", timeout=30)
cmds = [
    "curl -sI https://qrbanner.com/ | head -3",
    """cd /var/www/qrbanner && npx tsx -e "import { lookupGeo } from './lib/geoip'; console.log(JSON.stringify(lookupGeo('78.189.183.89')));" """,
    "grep -l 'serverExternalPackages' /var/www/qrbanner/next.config.js",
    "grep 'geoip-lite' /var/www/qrbanner/.next/server/app/s/\\[code\\]/route.js.nft.json | head -3 || echo checking nft; grep geoip /var/www/qrbanner/.next/server/app/s/\\[code\\]/route.js.nft.json | head -3",
]
for cmd in cmds:
    stdin, stdout, stderr = c.exec_command(cmd, timeout=60)
    print((stdout.read() + stderr.read()).decode("utf-8", errors="replace")[:500])
    print("---")
c.close()
