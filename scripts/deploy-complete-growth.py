#!/usr/bin/env python3
"""Deploy to VPS. Set DEPLOY_PASSWORD (see scripts/.env.deploy.example)."""
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
    "components/seo/programmatic-page-shell.tsx",
    "components/public-footer.tsx",
    "app/(public)/page.tsx",
    "app/(public)/qr-types/page.tsx",
    "app/(public)/qr-types/[slug]/page.tsx",
    "app/(public)/vs/page.tsx",
    "app/(public)/vs/[slug]/page.tsx",
    "app/(public)/integrations/zapier/page.tsx",
    "app/api/public/stats/route.ts",
    "app/api/qr/route.ts",
    "app/api/qr/[id]/route.ts",
    "app/api/qr/bulk/route.ts",
    "app/api/webhooks/route.ts",
    "app/api/webhooks/[id]/route.ts",
    "app/api/billing/checkout/route.ts",
    "app/sitemap.ts",
    "lib/public-stats.ts",
    "lib/authenticated-rate-limit.ts",
    "lib/plans.ts",
    "lib/stripe.ts",
    "lib/seo.ts",
    "lib/qr-type-pages.ts",
    "lib/competitor-pages.ts",
    "lib/i18n/pricing-content.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
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
_, o, _ = c.exec_command(
    f"cd {REMOTE} && yarn build > /tmp/qrb-complete.log 2>&1; echo EXIT:$?; tail -10 /tmp/qrb-complete.log",
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
