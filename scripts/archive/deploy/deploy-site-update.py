import paramiko
import os

local_base = r"C:\Users\ACRO Technology\qrbanner"
remote_base = "/var/www/qrbanner"

files = [
    "prisma/schema.prisma",
    "lib/plans.ts",
    "lib/plan-usage.ts",
    "lib/site-content.ts",
    "lib/analytics-export.ts",
    "app/layout.tsx",
    "app/sitemap.ts",
    "app/(public)/page.tsx",
    "app/(public)/features/page.tsx",
    "app/(public)/pricing/page.tsx",
    "app/(public)/privacy/page.tsx",
    "app/(public)/terms/page.tsx",
    "app/api/account/usage/route.ts",
    "app/api/qr/route.ts",
    "app/api/qr/bulk/route.ts",
    "app/api/domains/route.ts",
    "components/public-header.tsx",
    "components/public-footer.tsx",
    "components/landing/hero.tsx",
    "components/landing/features.tsx",
    "components/landing/how-it-works.tsx",
    "components/landing/pricing-section.tsx",
    "components/landing/cta.tsx",
    "components/dashboard/plan-usage-card.tsx",
    "components/dashboard/settings-content.tsx",
    "components/dashboard/dashboard-analytics.tsx",
    "components/qr/qr-analytics-view.tsx",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password="112358Onrks..", timeout=30)
sftp = c.open_sftp()

for rel in files:
    local = os.path.join(local_base, rel.replace("/", os.sep))
    remote = f"{remote_base}/{rel.replace(os.sep, '/')}"
    c.exec_command(f"mkdir -p '{os.path.dirname(remote)}'")[1].read()
    sftp.put(local, remote)
    print("uploaded", rel)

sftp.close()

for cmd in [
    "cd /var/www/qrbanner && yarn prisma generate 2>&1 | tail -2",
    "cd /var/www/qrbanner && yarn prisma db push --accept-data-loss 2>&1 | tail -4",
    "cd /var/www/qrbanner && yarn build 2>&1 | tail -25",
    "pm2 restart qrbanner",
]:
    print("\n>>>", cmd)
    o = c.exec_command(cmd, timeout=300)[1].read().decode("utf-8", errors="replace")
    print(o.encode("ascii", errors="replace").decode())

c.close()
print("\nDone.")
