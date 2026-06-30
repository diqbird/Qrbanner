#!/usr/bin/env python3
"""Deploy all recent fixes: guest create, UX, i18n, mockup, middleware, customer audit."""
import os
import paramiko

HOST, USER, PW = "31.97.113.170", "root", "112358Onrks.."
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"

FILES = [
    "middleware.ts",
    "lib/plans.ts",
    "lib/qr-create-draft.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "lib/i18n/pricing-content.ts",
    "lib/i18n/how-it-works.ts",
    "components/providers.tsx",
    "components/ui/sonner.tsx",
    "components/cookie-consent.tsx",
    "components/skip-to-main.tsx",
    "components/not-found-content.tsx",
    "components/auth/signup-form.tsx",
    "components/dashboard/dashboard-shell.tsx",
    "components/dashboard/dashboard-content.tsx",
    "components/dashboard/plan-usage-card.tsx",
    "components/public/pricing-page-content.tsx",
    "components/landing/features.tsx",
    "components/landing/pricing-section.tsx",
    "components/landing/how-it-works.tsx",
    "components/landing/faq-section.tsx",
    "components/landing/cta.tsx",
    "components/qr/qr-create-wizard.tsx",
    "components/qr/qr-preview.tsx",
    "components/qr/mockup-preview.tsx",
    "components/qr/scan-simulation.tsx",
    "components/qr/industry-template-guide.tsx",
    "app/not-found.tsx",
    "app/(public)/layout.tsx",
    "app/(public)/terms/page.tsx",
    "app/(public)/pricing/page.tsx",
    "app/(public)/qr/create/page.tsx",
    "app/(public)/solutions/[slug]/page.tsx",
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

# Remove deprecated duplicate route on server
old_route = f"{REMOTE}/app/(dashboard)/qr/create/page.tsx"
c.exec_command(f"rm -f '{old_route}'", timeout=30)
print("removed old dashboard qr/create route")

cmd = f"cd {REMOTE} && yarn build 2>&1 | tail -25"
out = c.exec_command(cmd, timeout=900)[1].read().decode("ascii", errors="replace")
print(out.encode("ascii", errors="replace").decode("ascii"))
open(os.path.join(LOCAL, "build-out.txt"), "w", encoding="utf-8").write(out)

if "Failed to compile" in out or "Type error" in out:
    raise SystemExit(1)

c.exec_command("pm2 restart qrbanner", timeout=60)
c.close()
print("DONE")
