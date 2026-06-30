#!/usr/bin/env python3
"""Deploy continued QA: i18n polish + fixed E2E specs."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

FILES = [
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "components/qr/print-banner-export.tsx",
    "components/qr/scan-simulation.tsx",
    "components/admin/admin-blog-panel.tsx",
    "components/dashboard/onboarding-banner.tsx",
    "components/dashboard/onboarding-checklist.tsx",
    "e2e/smoke.spec.ts",
    "e2e/qr-categories.spec.ts",
    "scripts/run-e2e-remote.py",
]

if not PW:
    print("ERROR: Set DEPLOY_PASSWORD", file=sys.stderr)
    sys.exit(1)


def ensure_remote_dir(sftp, remote_dir: str) -> None:
    parts = remote_dir.replace("\\", "/").strip("/").split("/")
    path = ""
    for part in parts:
        path += "/" + part
        try:
            sftp.stat(path)
        except OSError:
            sftp.mkdir(path)


print(f"Uploading {len(FILES)} files...")
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local_path = os.path.join(LOCAL, rel)
    remote_path = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    ensure_remote_dir(sftp, os.path.dirname(remote_path).replace("\\", "/"))
    sftp.put(local_path, remote_path)
    print("ok", rel)
sftp.close()

_, stdout, _ = c.exec_command(
    f"cd {REMOTE} && yarn build > /tmp/qrb-continued.log 2>&1; echo EXIT:$?; tail -20 /tmp/qrb-continued.log",
    timeout=600,
)
out = stdout.read().decode("utf-8", errors="replace")
log = os.path.join(LOCAL, "scripts", "deploy-continued-last.log")
with open(log, "w", encoding="utf-8") as f:
    f.write(out)
c.exec_command(f"cd {REMOTE} && pm2 restart qrbanner", timeout=30)
c.close()
if "EXIT:0" not in out:
    print("BUILD FAILED — see", log)
    sys.exit(1)
print("deploy ok")
