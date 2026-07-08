import paramiko
import os

local_base = r"C:\Users\ACRO Technology\qrbanner"
remote_base = "/var/www/qrbanner"

files = [
    "lib/seo.ts",
    "lib/site-content.ts",
    "app/layout.tsx",
    "app/manifest.ts",
    "app/robots.ts",
    "app/sitemap.ts",
    "app/opengraph-image.tsx",
    "app/(public)/layout.tsx",
    "app/(public)/page.tsx",
    "app/(public)/features/page.tsx",
    "app/(public)/pricing/page.tsx",
    "app/(public)/faq/page.tsx",
    "app/(public)/developers/page.tsx",
    "app/(public)/privacy/page.tsx",
    "app/(public)/terms/page.tsx",
    "app/(dashboard)/layout.tsx",
    "components/seo/json-ld.tsx",
    "components/seo/public-breadcrumbs.tsx",
    "components/landing/hero.tsx",
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
    remote_dir = os.path.dirname(remote).replace("\\", "/")
    c.exec_command(f"mkdir -p '{remote_dir}'")[1].read()
    sftp.put(local, remote)
    print("uploaded", rel)

sftp.close()

for cmd in [
    "cd /var/www/qrbanner && yarn build 2>&1 | tail -30",
    "pm2 restart qrbanner",
    "curl -sI https://qrbanner.com/robots.txt | head -5",
    "curl -s https://qrbanner.com/sitemap.xml | head -20",
]:
    print("\n>>>", cmd)
    o = c.exec_command(cmd, timeout=600)[1].read().decode("utf-8", errors="replace")
    print(o.encode("ascii", errors="replace").decode())

c.close()
print("\nSEO deploy complete.")
