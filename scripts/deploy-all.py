import paramiko
import os

local_base = r"C:\Users\ACRO Technology\qrbanner"
remote_base = "/var/www/qrbanner"

files = sorted(set([
    # schema
    "prisma/schema.prisma",
    # lib
    "lib/ab-routing.ts",
    "lib/analytics-range.ts",
    "lib/analytics-utils.ts",
    "lib/auth-options.ts",
    "lib/geoip.ts",
    "lib/gps-heatmap.ts",
    "lib/landing-page.ts",
    "lib/pixel-analytics.ts",
    "lib/plans.ts",
    "lib/seo.ts",
    "lib/site-content.ts",
    "lib/webhooks.ts",
    "lib/workspace.ts",
    # app core
    "app/layout.tsx",
    "app/manifest.ts",
    "app/robots.ts",
    "app/sitemap.ts",
    "app/opengraph-image.tsx",
    "app/s/[code]/route.ts",
    # api
    "app/api/dashboard/analytics/route.ts",
    "app/api/leads/route.ts",
    "app/api/qr/route.ts",
    "app/api/qr/[id]/route.ts",
    "app/api/qr/[id]/analytics/route.ts",
    "app/api/qr/[id]/leads/route.ts",
    "app/api/scan/geo/route.ts",
    "app/api/templates/route.ts",
    "app/api/templates/[id]/route.ts",
    "app/api/webhooks/route.ts",
    "app/api/webhooks/[id]/route.ts",
    "app/api/workspace/route.ts",
    "app/api/workspace/members/route.ts",
    "app/api/invite/[token]/route.ts",
    # public pages
    "app/(public)/layout.tsx",
    "app/(public)/page.tsx",
    "app/(public)/features/page.tsx",
    "app/(public)/pricing/page.tsx",
    "app/(public)/faq/page.tsx",
    "app/(public)/developers/page.tsx",
    "app/(public)/privacy/page.tsx",
    "app/(public)/terms/page.tsx",
    # auth
    "app/(auth)/invite/[token]/page.tsx",
    "app/(auth)/invite/[token]/layout.tsx",
    "app/(auth)/login/page.tsx",
    # dashboard
    "app/(dashboard)/layout.tsx",
    # components
    "components/auth/login-form.tsx",
    "components/dashboard/dashboard-analytics.tsx",
    "components/dashboard/settings-content.tsx",
    "components/dashboard/team-workspace-settings.tsx",
    "components/dashboard/webhook-settings.tsx",
    "components/landing/hero.tsx",
    "components/landing/faq-section.tsx",
    "components/public-header.tsx",
    "components/public-footer.tsx",
    "components/seo/json-ld.tsx",
    "components/seo/public-breadcrumbs.tsx",
    "components/qr/ab-test-settings.tsx",
    "components/qr/analytics-charts.tsx",
    "components/qr/gps-heatmap.tsx",
    "components/qr/landing-page-editor.tsx",
    "components/qr/lead-submissions-panel.tsx",
    "components/qr/nfc-export-panel.tsx",
    "components/qr/qr-analytics-view.tsx",
    "components/qr/qr-create-wizard.tsx",
    "components/qr/qr-edit-view.tsx",
    "components/qr/qr-style-editor.tsx",
    "components/qr/style-template-library.tsx",
]))

print(f"Deploying {len(files)} files...")

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password="112358Onrks..", timeout=30)
sftp = c.open_sftp()

for rel in files:
    local = os.path.join(local_base, rel.replace("/", os.sep))
    if not os.path.isfile(local):
        print("SKIP missing:", rel)
        continue
    remote = f"{remote_base}/{rel.replace(os.sep, '/')}"
    remote_dir = os.path.dirname(remote).replace("\\", "/")
    c.exec_command(f"mkdir -p '{remote_dir}'")[1].read()
    sftp.put(local, remote)
    print("uploaded", rel)

sftp.close()

cmds = [
    "cd /var/www/qrbanner && yarn prisma generate 2>&1 | tail -8",
    "cd /var/www/qrbanner && yarn prisma db push --accept-data-loss 2>&1 | tail -20",
    "cd /var/www/qrbanner && yarn build 2>&1 | tail -40",
    "pm2 restart qrbanner",
    "sleep 3 && curl -sI https://qrbanner.com/ | head -8",
    "curl -sI https://qrbanner.com/sitemap.xml | head -8",
    "curl -s https://qrbanner.com/sitemap.xml | head -15",
    "curl -s https://qrbanner.com/robots.txt",
]
for cmd in cmds:
    print("\n>>>", cmd)
    _, stdout, stderr = c.exec_command(cmd, timeout=900)
    o = stdout.read().decode("utf-8", errors="replace")
    e = stderr.read().decode("utf-8", errors="replace")
    out = (o + e).encode("ascii", errors="replace").decode()
    print(out)

c.close()
print("\n=== Deploy complete ===")
