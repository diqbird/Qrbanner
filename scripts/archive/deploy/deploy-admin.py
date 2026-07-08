#!/usr/bin/env python3
"""Deploy admin panel and grant admin role to site owner."""
import os
import paramiko
import time

HOST = "31.97.113.170"
USER = "root"
PASSWORD = os.environ["DEPLOY_PASSWORD"]
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"
OWNER_EMAIL = "acroacro35@gmail.com"

FILES = [
    "lib/admin-auth.ts",
    "app/api/admin/stats/route.ts",
    "app/api/admin/users/route.ts",
    "components/admin/admin-content.tsx",
    "app/(dashboard)/admin/page.tsx",
    "components/dashboard/dashboard-shell.tsx",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local = os.path.join(LOCAL, rel)
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    c.exec_command(f"mkdir -p '{os.path.dirname(remote)}'", timeout=30)
    sftp.put(local, remote)
    print("ok", rel)
sftp.close()

grant = r"""
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.update({ where: { email: '%s' }, data: { role: 'admin' } })
  .then(u => console.log('admin granted:', u.email))
  .catch(e => console.error(e.message))
  .finally(() => p.$disconnect());
""" % OWNER_EMAIL
with c.open_sftp().open(f"{REMOTE}/scripts/grant-admin.js", "w") as f:
    f.write(grant)
c.exec_command(f"cd {REMOTE} && node scripts/grant-admin.js", timeout=30)

o = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -10", timeout=900)[1].read().decode("ascii", errors="replace")
open(os.path.join(LOCAL, "build-out.txt"), "w", encoding="utf-8").write(o)
if "Failed to compile" in o:
    print("BUILD FAILED")
    c.close()
    raise SystemExit(1)

c.exec_command("pm2 restart qrbanner", timeout=60)
time.sleep(4)
print(c.exec_command("curl -sI https://qrbanner.com/admin | head -1", timeout=30)[1].read().decode())
c.close()
print("DONE")
