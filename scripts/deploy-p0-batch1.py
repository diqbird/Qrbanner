#!/usr/bin/env python3
"""Deploy P0 audit fixes batch 1: social proof + free limit + MFA."""
import os
import sys
import paramiko

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HOST = "31.97.113.170"
USER = "root"
PW = os.environ.get("DEPLOY_PASSWORD", "112358Onrks..")
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"

FILES = [
    "lib/api-mfa-exempt.ts",
    "lib/plans.ts",
    "lib/i18n/pricing-content.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "lib/competitor-pages.ts",
    "components/landing/customer-logos.tsx",
    "components/landing/reviews-strip.tsx",
    "components/landing/social-proof.tsx",
    "components/landing/hero-static.tsx",
    "components/landing/hero.tsx",
    "components/landing/billing-coming-soon-banner.tsx",
    "components/billing/billing-coming-soon-banner.tsx",
    "components/auth/referral-signup-banner.tsx",
    "components/solutions/solution-detail-shell.tsx",
    "components/public/features-page-content.tsx",
    "components/qr/qr-quick-create.tsx",
    "app/(public)/customers/page.tsx",
    "app/(public)/reviews/page.tsx",
    "app/(public)/reviews/prompts/page.tsx",
    "app/(public)/reviews/g2-setup/page.tsx",
    "app/(public)/case-studies/page.tsx",
    "app/(public)/case-studies/[slug]/page.tsx",
    "app/(public)/referral/page.tsx",
    "app/(public)/pricing/page.tsx",
    "app/(public)/qr-types/[slug]/page.tsx",
    "app/(public)/use-cases/[slug]/page.tsx",
    "app/sitemap.ts",
    "app/api/account/usage/route.ts",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local = os.path.join(LOCAL, rel)
    if not os.path.isfile(local):
        print("skip missing", rel)
        continue
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    remote_dir = os.path.dirname(remote).replace(chr(92), '/')
    c.exec_command(f"mkdir -p '{remote_dir}'", timeout=30)
    sftp.put(local, remote)
    print("ok", rel)
sftp.close()

for cmd in [
    f"cd {REMOTE} && yarn build 2>&1 | tail -20",
    "pm2 restart qrbanner 2>&1 | tail -3",
]:
    print("\n>>>", cmd[:80])
    _, stdout, stderr = c.exec_command(cmd, timeout=900)
    print(stdout.read().decode("utf-8", errors="replace") or stderr.read().decode("utf-8", errors="replace"))

c.close()
print("\nP0 batch 1 deployed.")
