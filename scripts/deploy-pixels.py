import paramiko
import os

local_base = r"C:\Users\ACRO Technology\qrbanner"
remote_base = "/var/www/qrbanner"

files = [
    "prisma/schema.prisma",
    "lib/pixel-analytics.ts",
    "lib/landing-page.ts",
    "app/s/[code]/route.ts",
    "app/api/qr/route.ts",
    "app/api/qr/[id]/route.ts",
    "components/qr/analytics-pixel-settings.tsx",
    "components/qr/qr-create-wizard.tsx",
    "components/qr/qr-edit-view.tsx",
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
    "cd /var/www/qrbanner && yarn build 2>&1 | tail -20",
    "pm2 restart qrbanner",
]:
    print("\n>>>", cmd)
    o = c.exec_command(cmd, timeout=300)[1].read().decode("utf-8", errors="replace")
    print(o.encode("ascii", errors="replace").decode())

c.close()
print("\nDone.")
