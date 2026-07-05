#!/usr/bin/env python3
"""Deploy final polish: contrast, enterprise skeleton, plan usage error state."""
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
    "app/globals.css",
    "app/manifest.ts",
    "components/landing/features.tsx",
    "components/landing/social-proof.tsx",
    "components/landing/industries-section.tsx",
    "components/landing/use-cases-teaser.tsx",
    "components/landing/pricing-section.tsx",
    "components/landing/integrations-teaser.tsx",
    "components/landing/hero-static.tsx",
    "components/landing/hero.tsx",
    "components/brand/site-logo.tsx",
    "components/i18n/language-switcher.tsx",
    "components/dashboard/enterprise-workspace-settings.tsx",
    "components/dashboard/plan-usage-card.tsx",
    "components/landing/cta.tsx",
    "components/theme-toggle.tsx",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    sftp.put(os.path.join(LOCAL, rel), f"{REMOTE}/{rel}")
    print("ok", rel)
sftp.close()

_, stdout, _ = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -8", timeout=900)
print(stdout.read().decode("utf-8", errors="replace"))
_, stdout, _ = c.exec_command("pm2 restart qrbanner 2>&1 | tail -2", timeout=60)
print(stdout.read().decode("utf-8", errors="replace"))
c.close()
print("Polish deployed.")
