#!/usr/bin/env python3
"""Deploy P4-24 workspace API scoping (campaigns + folders)."""
import os
import sys
import paramiko

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HOST = "31.97.113.170"
USER = "root"
PW = os.environ.get("DEPLOY_PASSWORD", "")
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"

FILES = [
    "prisma/schema.prisma",
    "lib/workspace.ts",
    "lib/campaigns.ts",
    "app/api/campaigns/route.ts",
    "app/api/campaigns/[id]/route.ts",
    "app/api/folders/route.ts",
    "app/api/folders/[id]/route.ts",
    "app/api/qr/route.ts",
    "app/api/qr/[id]/route.ts",
    "app/api/qr/organize/route.ts",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local = os.path.join(LOCAL, rel)
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    remote_dir = os.path.dirname(remote).replace(chr(92), "/")
    c.exec_command(f"mkdir -p '{remote_dir}'", timeout=30)
    sftp.put(local, remote)
    print("ok", rel)
sftp.close()

cmds = (
    f"cd {REMOTE} && "
    "npx prisma db push --skip-generate 2>&1 | tail -6 && "
    "npx prisma generate 2>&1 | tail -3 && "
    "yarn build 2>&1 | tail -8"
)
_, stdout, stderr = c.exec_command(cmds, timeout=900)
out = stdout.read().decode("utf-8", errors="replace")
err = stderr.read().decode("utf-8", errors="replace")
print(out or err)
if "Failed to compile" in out or "Failed to compile" in err:
    sys.exit(1)
_, stdout, _ = c.exec_command("pm2 restart qrbanner 2>&1 | tail -2", timeout=60)
print(stdout.read().decode("utf-8", errors="replace"))
c.close()
print("P4-24 deployed.")
