#!/usr/bin/env python3
"""Install daily QRbanner database backup cron on the VPS."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

CRON_LINE = "0 3 * * * /bin/bash /var/www/qrbanner/scripts/vps-backup-database.sh >> /var/log/qrbanner-backup.log 2>&1"

if not PW:
    print("ERROR: Set DEPLOY_PASSWORD", file=sys.stderr)
    sys.exit(1)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
local_script = os.path.join(LOCAL, "scripts", "vps-backup-database.sh")
remote_script = f"{REMOTE}/scripts/vps-backup-database.sh"
sftp.put(local_script, remote_script)
sftp.close()

cmds = [
    f"chmod +x {remote_script}",
    "mkdir -p /var/backups/qrbanner",
    "touch /var/log/qrbanner-backup.log",
    f"(crontab -l 2>/dev/null | grep -v vps-backup-database.sh; echo '{CRON_LINE}') | crontab -",
    "crontab -l | grep vps-backup-database || true",
]
for cmd in cmds:
    _, stdout, stderr = c.exec_command(cmd, timeout=60)
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if out:
        print(out)
    if err and "no crontab" not in err.lower():
        print(err)

c.close()
print("backup cron installed")
