#!/usr/bin/env python3
"""Deploy geoip / Top Countries fix."""
import os
import paramiko
import time

HOST = "31.97.113.170"
USER = "root"
PASSWORD = os.environ["DEPLOY_PASSWORD"]
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"

FILES = [
    "next.config.js",
    "lib/geoip.ts",
    "app/s/[code]/route.ts",
    "components/qr/analytics-charts.tsx",
    "scripts/backfill-scan-countries.ts",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local = os.path.join(LOCAL, rel)
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    os.makedirs(os.path.dirname(local), exist_ok=True)
    sftp.put(local, remote)
    print("uploaded", rel)
sftp.close()

cmds = [
    f"cd {REMOTE} && yarn build 2>&1 | tail -20",
    f"cd {REMOTE} && npx tsx scripts/backfill-scan-countries.ts",
    "pm2 restart qrbanner",
]
for cmd in cmds:
    print(">>>", cmd)
    stdin, stdout, stderr = c.exec_command(cmd, timeout=900)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    text = (out or err).encode("ascii", errors="replace").decode()
    print(text)
    if "Failed to compile" in out or "error Command failed" in out:
        print("BUILD FAILED")
        c.close()
        raise SystemExit(1)

time.sleep(5)
stdin, stdout, stderr = c.exec_command(
    f"""cd {REMOTE} && node -e "
const {{ PrismaClient }} = require('@prisma/client');
const p = new PrismaClient();
p.qRScan.groupBy({{ by: ['country'], _count: {{ id: true }}, orderBy: {{ _count: {{ id: 'desc' }} }}, take: 5 }})
  .then(r => {{ console.log(JSON.stringify(r)); return p.\\$disconnect(); }});
" """,
    timeout=60,
)
print("countries:", stdout.read().decode())
c.close()
print("DONE")
