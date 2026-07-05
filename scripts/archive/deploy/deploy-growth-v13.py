#!/usr/bin/env python3
"""Deploy Growth Pack v12+v13: referral, features, demo, logos, checkout coupon."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

FILES = [
    # v12
    "lib/referral.ts",
    "lib/referral-stripe.ts",
    "lib/referral-checkout.ts",
    "lib/auth-options.ts",
    "lib/case-studies.ts",
    "lib/competitor-pages.ts",
    "lib/blog/posts-service.ts",
    "lib/blog/posts/referral-program-guide.ts",
    "lib/blog/posts/dynamic-vs-static-qr.ts",
    "lib/blog/posts/university-wayfinding-qr.ts",
    "lib/blog/posts/logistics-warehouse-qr.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "app/sitemap.ts",
    "app/api/referral/route.ts",
    "app/api/referral/claim-reward/route.ts",
    "app/api/billing/checkout/route.ts",
    "app/(public)/demo/page.tsx",
    "components/auth/referral-cookie-sync.tsx",
    "components/auth/signup-form.tsx",
    "components/auth/login-form.tsx",
    "components/dashboard/referral-settings.tsx",
    "components/dashboard/referral-reward-claim.tsx",
    "components/public/features-page-content.tsx",
    "components/public/pricing-page-content.tsx",
    "components/marketing/pricing-referral-banner.tsx",
    "components/landing/hero-static.tsx",
    "components/landing/customer-logos.tsx",
    "public/logos/fnb.svg",
    "public/logos/retail.svg",
    "public/logos/hotels.svg",
    "public/logos/events.svg",
    "public/logos/health.svg",
    "public/logos/agencies.svg",
    "public/logos/education.svg",
    "public/logos/government.svg",
    "public/logos/grocery.svg",
    "public/logos/cinema.svg",
    "public/logos/logistics.svg",
    "scripts/.env.marketing.example",
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

_, o, _ = c.exec_command(
    f"cd {REMOTE} && yarn build > /tmp/qrb-growth13.log 2>&1; echo EXIT:$?; tail -12 /tmp/qrb-growth13.log",
    timeout=600,
)
out = o.read().decode("utf-8", errors="replace")
with open(os.path.join(LOCAL, "scripts", "_deploy_growth13.txt"), "w", encoding="utf-8") as f:
    f.write(out)
_, o, _ = c.exec_command(f"cd {REMOTE} && pm2 restart qrbanner 2>/dev/null; echo done", timeout=30)
c.close()
if "EXIT:0" not in out:
    print("BUILD FAILED")
    sys.exit(1)
print("deploy ok")
