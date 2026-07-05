#!/usr/bin/env python3
"""Deploy step 1-2: Lighthouse thresholds + admin launch banner i18n."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

FILES = [
    "scripts/lighthouse-audit.mjs",
    "scripts/run-lighthouse-remote.py",
    ".github/workflows/qa.yml",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "components/admin/admin-content.tsx",
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
    f"cd {REMOTE} && yarn build > /tmp/qrb-step.log 2>&1; echo EXIT:$?; tail -8 /tmp/qrb-step.log",
    timeout=600,
)
out = stdout.read().decode("utf-8", errors="replace")
c.exec_command(f"cd {REMOTE} && pm2 restart qrbanner", timeout=30)

# Check git on VPS
_, gout, _ = c.exec_command(
    f"cd {REMOTE} && (test -d .git && git remote -v && git status -sb || echo NO_GIT_REPO)",
    timeout=30,
)
git_info = gout.read().decode("utf-8", errors="replace")
c.close()

with open(os.path.join(LOCAL, "scripts", "deploy-step-last.log"), "w", encoding="utf-8") as f:
    f.write(out)
    f.write("\n--- git ---\n")
    f.write(git_info)

if "EXIT:0" not in out:
    print("BUILD FAILED")
    sys.exit(1)
print("deploy ok")
print("--- VPS git ---")
print(git_info.strip() or "(empty)")
