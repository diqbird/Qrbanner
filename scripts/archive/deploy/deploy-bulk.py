import paramiko
import os
import sys

local_base = r"C:\Users\ACRO Technology\qrbanner"
remote_base = "/var/www/qrbanner"

files = sys.argv[1:] if len(sys.argv) > 1 else [
    "prisma/schema.prisma",
    "lib/bulk-csv.ts",
    "app/api/qr/bulk/route.ts",
    "app/api/qr/route.ts",
    "app/(dashboard)/qr/bulk/page.tsx",
    "components/qr/qr-bulk-import.tsx",
    "components/dashboard/dashboard-shell.tsx",
    "components/dashboard/dashboard-content.tsx",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password=os.environ["DEPLOY_PASSWORD"], timeout=20)
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
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    safe_out = out[-4000:] if len(out) > 4000 else out
    safe_err = err[-2000:] if len(err) > 2000 else err
    print(safe_out.encode("ascii", errors="replace").decode("ascii"))
    if safe_err.strip():
        print(safe_err.encode("ascii", errors="replace").decode("ascii"))

c.close()
print("\nDeploy complete.")
