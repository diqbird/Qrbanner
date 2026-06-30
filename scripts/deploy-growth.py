#!/usr/bin/env python3
"""Deploy changed files to VPS. Credentials from environment (see scripts/.env.deploy.example)."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

FILES = [
    "components/landing/social-proof.tsx",
    "components/landing/pricing-section.tsx",
    "components/public/pricing-page-content.tsx",
    "components/dashboard/plan-upgrade-banner.tsx",
    "components/dashboard/top-qr-widget.tsx",
    "components/dashboard/dashboard-content.tsx",
    "components/dashboard/plan-usage-card.tsx",
    "app/(public)/page.tsx",
    "app/api/public/stats/route.ts",
    "app/api/qr/route.ts",
    "app/api/qr/[id]/route.ts",
    "app/api/qr/bulk/route.ts",
    "app/api/webhooks/route.ts",
    "app/api/webhooks/[id]/route.ts",
    "app/api/billing/checkout/route.ts",
    "lib/public-stats.ts",
    "lib/authenticated-rate-limit.ts",
    "lib/plans.ts",
    "lib/stripe.ts",
    "lib/seo.ts",
    "lib/i18n/pricing-content.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
]

if not PW:
    print("ERROR: Set DEPLOY_PASSWORD environment variable", file=sys.stderr)
    sys.exit(1)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local_path = os.path.join(LOCAL, rel)
    remote_path = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    sftp.put(local_path, remote_path)
    print("ok", rel)
sftp.close()
_, o, _ = c.exec_command(
    f"cd {REMOTE} && yarn build > /tmp/qrb-growth.log 2>&1; echo EXIT:$?; tail -8 /tmp/qrb-growth.log",
    timeout=600,
)
out = o.read().decode("utf-8", errors="replace")
out_path = os.path.join(LOCAL, "scripts", "_deploy_out.txt")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(out)
print(out.encode("ascii", errors="replace").decode("ascii"))
c.exec_command("pm2 restart qrbanner", timeout=30)
c.close()
print("done")
