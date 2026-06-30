import paramiko
import os

local_base = r"C:\Users\ACRO Technology\qrbanner"
remote_base = "/var/www/qrbanner"

files = [
    "prisma/schema.prisma",
    "lib/api-key.ts",
    "lib/api-auth.ts",
    "lib/api-serialize.ts",
    "app/api/auth/api-key/route.ts",
    "app/api/v1/route.ts",
    "app/api/v1/qr/route.ts",
    "app/api/v1/qr/[id]/route.ts",
    "app/api/v1/folders/route.ts",
    "app/api/v1/folders/[id]/route.ts",
    "components/dashboard/api-key-settings.tsx",
    "components/dashboard/settings-content.tsx",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password="112358Onrks..", timeout=20)
sftp = c.open_sftp()

for rel in files:
    local = os.path.join(local_base, rel.replace("/", os.sep))
    remote = f"{remote_base}/{rel.replace(os.sep, '/')}"
    remote_dir = os.path.dirname(remote)
    c.exec_command(f"mkdir -p '{remote_dir}'")[1].read()
    sftp.put(local, remote)
    print(f"uploaded {rel}")

sftp.close()

cmds = [
    "cd /var/www/qrbanner && yarn prisma generate",
    "cd /var/www/qrbanner && yarn prisma db push",
    "cd /var/www/qrbanner && yarn build",
    "pm2 restart qrbanner",
]

for cmd in cmds:
    print(f"\n>>> {cmd}")
    stdin, stdout, stderr = c.exec_command(cmd, get_pty=True)
    out = stdout.read().decode("utf-8", errors="replace")
    print(out[-6000:].encode("ascii", errors="replace").decode("ascii"))

c.close()
print("\nDeploy complete.")
