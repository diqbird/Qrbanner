import paramiko
import os

local_base = r"C:\Users\ACRO Technology\qrbanner"
remote_base = "/var/www/qrbanner"

files = [
    "prisma/schema.prisma",
    "lib/ab-routing.ts",
    "lib/workspace.ts",
    "lib/gps-heatmap.ts",
    "lib/geoip.ts",
    "lib/analytics-utils.ts",
    "lib/auth-options.ts",
    "lib/landing-page.ts",
    "lib/pixel-analytics.ts",
    "lib/site-content.ts",
    "lib/seo.ts",
    "app/s/[code]/route.ts",
    "app/api/scan/geo/route.ts",
    "app/api/workspace/route.ts",
    "app/api/workspace/members/route.ts",
    "app/api/invite/[token]/route.ts",
    "app/api/qr/route.ts",
    "app/api/qr/[id]/route.ts",
    "app/api/qr/[id]/analytics/route.ts",
    "app/api/dashboard/analytics/route.ts",
    "app/(auth)/invite/[token]/page.tsx",
    "components/auth/login-form.tsx",
    "components/dashboard/settings-content.tsx",
    "components/dashboard/team-workspace-settings.tsx",
    "components/qr/ab-test-settings.tsx",
    "components/qr/nfc-export-panel.tsx",
    "components/qr/gps-heatmap.tsx",
    "components/qr/analytics-charts.tsx",
    "components/qr/qr-create-wizard.tsx",
    "components/qr/qr-edit-view.tsx",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password=os.environ["DEPLOY_PASSWORD"], timeout=30)
sftp = c.open_sftp()

for rel in files:
    local = os.path.join(local_base, rel.replace("/", os.sep))
    remote = f"{remote_base}/{rel.replace(os.sep, '/')}"
    remote_dir = os.path.dirname(remote).replace("\\", "/")
    c.exec_command(f"mkdir -p '{remote_dir}'")[1].read()
    sftp.put(local, remote)
    print("uploaded", rel)

sftp.close()

for cmd in [
    "cd /var/www/qrbanner && yarn prisma generate 2>&1 | tail -5",
    "cd /var/www/qrbanner && yarn prisma db push --accept-data-loss 2>&1 | tail -15",
    "cd /var/www/qrbanner && yarn build 2>&1 | tail -35",
    "pm2 restart qrbanner",
]:
    print("\n>>>", cmd)
    o = c.exec_command(cmd, timeout=600)[1].read().decode("utf-8", errors="replace")
    print(o.encode("ascii", errors="replace").decode())

c.close()
print("\nDeploy complete.")
