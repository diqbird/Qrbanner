#!/usr/bin/env python3
import os, paramiko
HOST, USER, PW = "31.97.113.170", "root", os.environ["DEPLOY_PASSWORD"]
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"
FILES = [
    "lib/plans.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "lib/i18n/pricing-content.ts",
    "lib/i18n/how-it-works.ts",
    "components/landing/features.tsx",
    "components/landing/pricing-section.tsx",
    "components/landing/how-it-works.tsx",
    "components/landing/faq-section.tsx",
    "components/landing/cta.tsx",
    "components/cookie-consent.tsx",
    "components/skip-to-main.tsx",
    "components/not-found-content.tsx",
    "components/providers.tsx",
    "components/auth/signup-form.tsx",
    "components/dashboard/dashboard-shell.tsx",
    "components/dashboard/plan-usage-card.tsx",
    "components/dashboard/dashboard-content.tsx",
    "components/public/pricing-page-content.tsx",
    "app/not-found.tsx",
    "app/(public)/layout.tsx",
    "app/(public)/terms/page.tsx",
    "app/(public)/solutions/[slug]/page.tsx",
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
    f"cd {REMOTE} && yarn build 2>&1 | tail -20",
]
build_out = []
for cmd in cmds:
    o = c.exec_command(cmd, timeout=900)[1].read().decode("ascii", errors="replace")
    build_out.append(o)
    print(o.encode("ascii", errors="replace").decode("ascii"))
full = "\n".join(build_out)
open(os.path.join(LOCAL, "build-out.txt"), "w", encoding="utf-8").write(full)
if "Failed to compile" in full or "Type error" in full:
    raise SystemExit(1)
c.exec_command("pm2 restart qrbanner", timeout=60)
c.close()
print("DONE")
