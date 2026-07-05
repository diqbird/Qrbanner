#!/usr/bin/env python3
"""Deploy Senior QA fixes (SAML redirect, pricing hydration, domains fetch, referral API)."""
import os
import sys
import paramiko

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HOST = "31.97.113.170"
USER = "root"
PW = os.environ.get("DEPLOY_PASSWORD", "112358Onrks..")
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"

FILES = [
    "lib/request-site-url.ts",
    "lib/public-billing-status.ts",
    "lib/use-scan-base-url.ts",
    "app/api/auth/saml/login/route.ts",
    "app/api/auth/saml/acs/route.ts",
    "app/api/billing/status/route.ts",
    "app/api/referral/claim-reward/route.ts",
    "app/(public)/pricing/page.tsx",
    "components/public/pricing-page-content.tsx",
    "hooks/use-billing-status.ts",
    "hooks/use-plan-checkout.ts",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    sftp.put(os.path.join(LOCAL, rel), f"{REMOTE}/{rel}")
    print("ok", rel)
sftp.close()

_, stdout, stderr = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -12", timeout=900)
out = stdout.read().decode("utf-8", errors="replace")
print(out)
err = stderr.read().decode("utf-8", errors="replace")
if err.strip():
    print("stderr:", err[-800:])
_, stdout, _ = c.exec_command("pm2 restart qrbanner 2>&1 | tail -2", timeout=60)
print(stdout.read().decode("utf-8", errors="replace"))
c.close()
print("QA fixes deployed.")
