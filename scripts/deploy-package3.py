#!/usr/bin/env python3
"""Deploy Package 3: campaigns, referral, blog, AI landing, agency plan."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

FILES = [
    "prisma/schema.prisma",
    "lib/plans.ts",
    "lib/stripe.ts",
    "lib/campaigns.ts",
    "lib/referral.ts",
    "lib/landing-ai.ts",
    "lib/landing-page.ts",
    "lib/blog/posts-service.ts",
    "lib/blog/posts/restaurant-menu-qr.ts",
    "lib/blog/posts/wifi-qr-guide.ts",
    "lib/blog/posts/qr-analytics-guide.ts",
    "lib/blog/posts/qr-security-guide.ts",
    "lib/blog/posts/bulk-qr-guide.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "lib/i18n/pricing-content.ts",
    "app/api/campaigns/route.ts",
    "app/api/campaigns/[id]/route.ts",
    "app/api/referral/route.ts",
    "app/api/signup/route.ts",
    "app/s/[code]/route.ts",
    "components/dashboard/campaigns-panel.tsx",
    "components/dashboard/dashboard-content.tsx",
    "components/dashboard/referral-settings.tsx",
    "components/dashboard/settings-content.tsx",
    "components/auth/signup-form.tsx",
    "components/qr/landing-page-editor.tsx",
    "components/qr/qr-edit-view.tsx",
    "components/qr/qr-create-wizard.tsx",
]

if not PW:
    print("ERROR: Set DEPLOY_PASSWORD environment variable", file=sys.stderr)
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

print("Running prisma db push...")
_, o, e = c.exec_command(
    f"cd {REMOTE} && npx prisma db push --accept-data-loss > /tmp/qrb-p3-db.log 2>&1; echo DBEXIT:$?; tail -5 /tmp/qrb-p3-db.log",
    timeout=120,
)
db_out = o.read().decode("utf-8", errors="replace")
with open(os.path.join(LOCAL, "scripts", "_deploy_p3_db.txt"), "w", encoding="utf-8") as f:
    f.write(db_out)
print("db push done - see scripts/_deploy_p3_db.txt")

print("Running yarn build...")
_, o, _ = c.exec_command(
    f"cd {REMOTE} && yarn build > /tmp/qrb-p3-build.log 2>&1; echo EXIT:$?; tail -15 /tmp/qrb-p3-build.log",
    timeout=600,
)
out = o.read().decode("utf-8", errors="replace")
with open(os.path.join(LOCAL, "scripts", "_deploy_p3_build.txt"), "w", encoding="utf-8") as f:
    f.write(out)
print("build done - see scripts/_deploy_p3_build.txt")

_, o, _ = c.exec_command(
    f"cd {REMOTE} && pm2 restart qrbanner 2>/dev/null || systemctl restart qrbanner 2>/dev/null; echo RESTARTED",
    timeout=30,
)
restart_out = o.read().decode("utf-8", errors="replace")
with open(os.path.join(LOCAL, "scripts", "_deploy_p3_restart.txt"), "w", encoding="utf-8") as f:
    f.write(restart_out)
c.close()

if "EXIT:0" not in out:
    sys.exit(1)
