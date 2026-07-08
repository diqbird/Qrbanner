import paramiko
import os

local_base = r"C:\Users\ACRO Technology\qrbanner"
remote_base = "/var/www/qrbanner"

files = [
    "lib/seo.ts",
    "app/layout.tsx",
    "app/icon.tsx",
    "app/opengraph-image.tsx",
    "app/manifest.ts",
    "app/sitemap.ts",
    "app/robots.ts",
    "middleware.ts",
    "app/(public)/layout.tsx",
    "app/(public)/page.tsx",
    "app/(public)/features/page.tsx",
    "app/(public)/pricing/page.tsx",
    "app/(public)/privacy/page.tsx",
    "app/(public)/terms/page.tsx",
    "app/(public)/faq/page.tsx",
    "app/(public)/developers/page.tsx",
    "app/(auth)/login/page.tsx",
    "app/(auth)/signup/page.tsx",
    "app/(auth)/verify/page.tsx",
    "components/seo/json-ld.tsx",
    "components/landing/faq-section.tsx",
    "components/public-header.tsx",
    "components/public-footer.tsx",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password=os.environ["DEPLOY_PASSWORD"], timeout=30)
sftp = c.open_sftp()

for rel in files:
    local = os.path.join(local_base, rel.replace("/", os.sep))
    remote = f"{remote_base}/{rel.replace(os.sep, '/')}"
    c.exec_command(f"mkdir -p '{os.path.dirname(remote)}'")[1].read()
    sftp.put(local, remote)
    print("uploaded", rel)

sftp.close()

for cmd in [
    "cd /var/www/qrbanner && yarn build 2>&1 | tail -28",
    "pm2 restart qrbanner",
]:
    print("\n>>>", cmd)
    o = c.exec_command(cmd, timeout=300)[1].read().decode("utf-8", errors="replace")
    print(o.encode("ascii", errors="replace").decode())

c.close()
print("\nDone.")
