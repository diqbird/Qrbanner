#!/usr/bin/env python3
"""Deploy P0-5 billing closed mode + P0-6 opacity fix."""
import os
import sys
import paramiko

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HOST = "31.97.113.170"
USER = "root"
PW = os.environ.get("DEPLOY_PASSWORD", "")
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"

FILES = [
    "lib/pricing-display.ts",
    "lib/plans.ts",
    "lib/i18n/pricing-content.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "hooks/use-plan-checkout.ts",
    "components/billing/pricing-plan-card-button.tsx",
    "components/billing/billing-coming-soon-banner.tsx",
    "components/public/pricing-page-content.tsx",
    "components/landing/pricing-section.tsx",
    "components/landing/cta.tsx",
    "components/landing/features.tsx",
    "components/landing/faq-section.tsx",
    "components/landing/how-it-works.tsx",
    "components/dashboard/plan-usage-card.tsx",
    "app/(public)/pay/layout.tsx",
    "app/api/account/usage/route.ts",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local = os.path.join(LOCAL, rel)
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    remote_dir = os.path.dirname(remote).replace(chr(92), "/")
    c.exec_command(f"mkdir -p '{remote_dir}'", timeout=30)
    sftp.put(local, remote)
    print("ok", rel)
sftp.close()

_, stdout, stderr = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -12", timeout=900)
out = stdout.read().decode("utf-8", errors="replace")
err = stderr.read().decode("utf-8", errors="replace")
print(out or err)
if "Failed to compile" in out or "Failed to compile" in err:
    sys.exit(1)
_, stdout, _ = c.exec_command("pm2 restart qrbanner 2>&1 | tail -2", timeout=60)
print(stdout.read().decode("utf-8", errors="replace"))
c.close()
print("P0-5 + P0-6 deployed.")
