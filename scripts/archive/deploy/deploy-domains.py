import paramiko
import os

local_base = r"C:\Users\ACRO Technology\qrbanner"
remote_base = "/var/www/qrbanner"

files = [
    "middleware.ts",
    "prisma/schema.prisma",
    "lib/custom-domain.ts",
    "lib/api-serialize.ts",
    "lib/use-scan-base-url.ts",
    "app/api/domains/route.ts",
    "app/api/domains/[id]/route.ts",
    "app/api/domains/[id]/verify/route.ts",
    "app/s/[code]/route.ts",
    "app/api/v1/qr/route.ts",
    "app/api/v1/qr/[id]/route.ts",
    "components/dashboard/custom-domain-settings.tsx",
    "components/dashboard/settings-content.tsx",
    "components/qr/qr-preview.tsx",
    "components/qr/qr-edit-view.tsx",
    "components/qr/print-banner-export.tsx",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password=os.environ["DEPLOY_PASSWORD"], timeout=30)
sftp = c.open_sftp()

for rel in files:
    local = os.path.join(local_base, rel.replace("/", os.sep))
    remote = f"{remote_base}/{rel.replace(os.sep, '/')}"
    remote_dir = os.path.dirname(remote)
    c.exec_command(f"mkdir -p '{remote_dir}'")[1].read()
    sftp.put(local, remote)
    print("uploaded", rel)

sftp.close()

cmds = [
    "cd /var/www/qrbanner && yarn prisma generate 2>&1 | tail -3",
    "cd /var/www/qrbanner && yarn prisma db push 2>&1 | tail -5",
    "cd /var/www/qrbanner && yarn build 2>&1 | tail -25",
    "pm2 restart qrbanner",
]

for cmd in cmds:
    print("\n>>>", cmd)
    stdin, stdout, stderr = c.exec_command(cmd, timeout=300)
    print(stdout.read().decode("utf-8", errors="replace").encode("ascii", errors="replace").decode())

c.close()
print("\nDeploy complete.")
