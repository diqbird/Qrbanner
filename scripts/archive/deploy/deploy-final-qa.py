#!/usr/bin/env python3
"""Deploy final QA batch: i18n, E2E hooks, Playwright + Lighthouse CI."""
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
    "lib/i18n/fields.ts",
    "components/dashboard/media-library-card.tsx",
    "components/dashboard/dashboard-content.tsx",
    "components/qr/category-fields.tsx",
    "components/qr/landing-page-editor.tsx",
    "components/qr/qr-create-wizard.tsx",
    "components/auth/login-form.tsx",
    "components/auth/signup-form.tsx",
    "components/auth/forgot-password-form.tsx",
    "components/auth/verify-form.tsx",
    "playwright.config.mjs",
    "tsconfig.json",
    "package.json",
    "e2e/smoke.spec.ts",
    "e2e/i18n.spec.ts",
    "e2e/qr-categories.spec.ts",
    "e2e/forms-security.spec.ts",
    "scripts/lighthouse-audit.mjs",
    ".github/workflows/qa.yml",
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

print("Building on VPS...")
stdin, stdout, stderr = c.exec_command(
    f"rm -f {REMOTE}/playwright.config.ts && cd {REMOTE} && yarn build > /tmp/qrb-final-qa.log 2>&1; echo EXIT:$?; tail -30 /tmp/qrb-final-qa.log",
    timeout=600,
)
out = stdout.read().decode("utf-8", errors="replace")
err = stderr.read().decode("utf-8", errors="replace")
log_path = os.path.join(LOCAL, "scripts", "deploy-final-qa-last.log")
with open(log_path, "w", encoding="utf-8") as f:
    f.write(out)
    if err:
        f.write("\n--- stderr ---\n")
        f.write(err)
print(f"Build log: {log_path}")
c.exec_command(f"cd {REMOTE} && pm2 restart qrbanner", timeout=30)
c.close()
if "EXIT:0" not in out:
    print("BUILD FAILED")
    sys.exit(1)
print("deploy ok")
sys.exit(0)
