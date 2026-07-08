#!/usr/bin/env python3
"""Deploy 20-item audit fix batch."""
import os
import paramiko

HOST, USER, PW = "31.97.113.170", "root", os.environ["DEPLOY_PASSWORD"]
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"

FILES = [
    "package.json",
    "next.config.js",
    "prisma/schema.prisma",
    "middleware.ts",
    "app/layout.tsx",
    "app/sitemap.ts",
    "lib/auth-options.ts",
    "lib/seo.ts",
    "lib/security-headers.ts",
    "lib/rate-limit.ts",
    "lib/rate-limit-store.ts",
    "lib/validate-qr-urls.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "app/api/signup/route.ts",
    "app/api/verify/route.ts",
    "app/api/verify/resend/route.ts",
    "app/api/invite/[token]/route.ts",
    "app/api/qr/route.ts",
    "app/api/qr/[id]/route.ts",
    "app/api/v1/qr/route.ts",
    "app/api/upload/route.ts",
    "components/auth/verify-form.tsx",
    "components/auth/signup-form.tsx",
    "components/auth/login-form.tsx",
    "components/dashboard/dashboard-shell.tsx",
    "components/dashboard/settings-content.tsx",
    "components/qr/qr-create-wizard.tsx",
    "components/admin/admin-content.tsx",
    "components/admin/admin-blog-panel.tsx",
    "components/landing/features.tsx",
    "components/landing/how-it-works.tsx",
    "components/landing/faq-section.tsx",
    "components/landing/cta.tsx",
    "components/landing/pricing-section.tsx",
    "components/public/pricing-page-content.tsx",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()

for rel in FILES:
    local = os.path.join(LOCAL, rel)
    if not os.path.isfile(local):
        print("SKIP missing", rel)
        continue
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    c.exec_command(f"mkdir -p '{os.path.dirname(remote)}'", timeout=30)
    sftp.put(local, remote)
    print("ok", rel)

sftp.close()

cmds = [
    f"cd {REMOTE} && yarn install --ignore-engines 2>&1 | tail -5",
    f"cd {REMOTE} && npx prisma db push --skip-generate 2>&1 | tail -8",
    f"cd {REMOTE} && npx prisma generate 2>&1 | tail -3",
    f"cd {REMOTE} && yarn build 2>&1 | tail -25",
    "pm2 restart qrbanner 2>&1",
]
for cmd in cmds:
    print("\n>>>", cmd[:80])
    _, stdout, stderr = c.exec_command(cmd, timeout=600)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    print(out or err)

c.close()
print("\nDeploy complete.")
