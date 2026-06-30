#!/usr/bin/env python3
import os, paramiko
HOST, USER, PW = "31.97.113.170", "root", "112358Onrks.."
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"
FILES = [
    "package.json",
    "prisma/schema.prisma",
    "lib/i18n/faq-items.ts",
    "lib/i18n/pricing-content.ts",
    "lib/i18n/feature-groups.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "lib/stripe.ts",
    "components/public/faq-page-content.tsx",
    "components/public/pricing-page-content.tsx",
    "components/public/features-page-content.tsx",
    "components/dashboard/plan-usage-card.tsx",
    "app/(public)/faq/page.tsx",
    "app/(public)/pricing/page.tsx",
    "app/(public)/features/page.tsx",
    "app/api/billing/checkout/route.ts",
    "app/api/billing/webhook/route.ts",
    "components/landing/faq-section.tsx",
]
c = paramiko.SSHClient(); c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    c.exec_command(f"mkdir -p '{os.path.dirname(remote)}'", timeout=30)
    sftp.put(os.path.join(LOCAL, rel), remote)
    print("ok", rel)
sftp.close()
cmds = [
    f"cd {REMOTE} && yarn install --ignore-engines 2>&1 | tail -8",
    f"cd {REMOTE} && npx prisma db push --skip-generate 2>&1 | tail -8",
    f"cd {REMOTE} && npx prisma generate 2>&1 | tail -3",
    f"cd {REMOTE} && yarn build 2>&1 | tail -15",
]
build_out = []
for cmd in cmds:
    o = c.exec_command(cmd, timeout=900)[1].read().decode("ascii", errors="replace")
    build_out.append(o)
    print(o.encode("ascii", errors="replace").decode("ascii"))
full = "\n".join(build_out)
open(os.path.join(LOCAL, "build-out.txt"), "w", encoding="utf-8").write(full)
if "Failed to compile" in full:
    raise SystemExit(1)
c.exec_command("pm2 restart qrbanner", timeout=60)
c.close()
print("DONE")
