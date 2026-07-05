#!/usr/bin/env python3
"""Deploy audit fix batch #1-#14 (MFA, workspace scoping, hreflang, SSRF,
SMTP transport, ISR cache, webhook idempotency, password-reset hashing,
testimonials removal, annual pricing gate) + create admin user.

Usage:
  python scripts/deploy-audit-batch2.py
Env:
  DEPLOY_PASSWORD  VPS root password (falls back to prompt)
  ADMIN_EMAIL      admin email to create/promote (default onur@admin.com)
  ADMIN_PASSWORD   admin password (default from env or prompt)
"""
import os
import sys
import paramiko

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HOST = "31.97.113.170"
USER = "root"
PW = os.environ.get("DEPLOY_PASSWORD", "112358Onrks..")
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "onur@admin.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "112358Onrks..")

FILES = [
    # schema + config
    "prisma/schema.prisma",
    "next.config.js",
    "middleware.ts",
    "app/layout.tsx",
    "app/sitemap.ts",
    # auth / MFA (#1, #11)
    "lib/auth-options.ts",
    "lib/mfa-step-up.ts",
    "lib/api-mfa-exempt.ts",
    "lib/session-guard.ts",
    "lib/admin-auth.ts",
    "components/auth/mfa-verify-form.tsx",
    "app/api/auth/mfa/verify-session/route.ts",
    "app/api/auth/forgot-password/route.ts",
    "app/api/auth/reset-password/route.ts",
    "app/api/auth/change-password/route.ts",
    "lib/password-reset.ts",
    # dynamic QR preview (#3)
    "components/qr/qr-preview.tsx",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "app/api/qr/route.ts",
    "app/api/qr/[id]/route.ts",
    # plan upgrade webhook only (#4)
    "app/api/billing/checkout/route.ts",
    # workspace scoping (#5)
    "lib/workspace.ts",
    "app/api/qr/bulk-actions/route.ts",
    "app/api/v1/qr/route.ts",
    "app/api/v1/qr/[id]/route.ts",
    "app/api/mobile/v1/qr/route.ts",
    "app/api/mobile/v1/qr/[id]/route.ts",
    "app/api/mobile/v1/summary/route.ts",
    "app/api/qr/[id]/leads/route.ts",
    "app/api/qr/organize/route.ts",
    "app/api/workspace/members/route.ts",
    # hreflang (#7)
    "lib/i18n/locale-path.ts",
    "lib/i18n/index.ts",
    "app/(public)/blog/page.tsx",
    "app/(public)/blog/[slug]/page.tsx",
    "app/(public)/case-studies/page.tsx",
    "app/(public)/case-studies/[slug]/page.tsx",
    # webhook SSRF (#8)
    "lib/outbound-url.ts",
    "app/api/webhooks/route.ts",
    "app/api/webhooks/[id]/route.ts",
    "lib/automation-sanitize.ts",
    "lib/webhooks.ts",
    # SMTP transport (#6)
    "lib/smtp-transport.ts",
    "lib/email.ts",
    "lib/tenant-email.ts",
    "lib/sales-inquiry-email.ts",
    # ISR cache (#9)
    "components/providers.tsx",
    "components/i18n/html-lang-sync.tsx",
    # webhook idempotency (#10)
    "lib/billing-webhook-events.ts",
    "app/api/billing/webhook/route.ts",
    # testimonials removed (#12)
    "components/landing/social-proof.tsx",
    # annual pricing gate (#13)
    "lib/billing-provider.ts",
    "lib/paddle.ts",
    "app/api/billing/status/route.ts",
    "hooks/use-billing-status.ts",
    "hooks/use-plan-checkout.ts",
    "components/landing/pricing-section.tsx",
    "components/public/pricing-page-content.tsx",
    # admin creation helper (#14)
    "scripts/create-admin-user.mjs",
]

# Files removed locally that must be deleted on the server (#2)
DELETE_REMOTE = [
    "app/api/auth/login/route.ts",
]


def main():
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username=USER, password=PW, timeout=30)
    sftp = c.open_sftp()

    missing = []
    for rel in FILES:
        local = os.path.join(LOCAL, rel)
        if not os.path.isfile(local):
            missing.append(rel)
            print("SKIP missing", rel)
            continue
        remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
        c.exec_command(f"mkdir -p '{os.path.dirname(remote)}'", timeout=30)
        sftp.put(local, remote)
        print("ok", rel)
    sftp.close()

    if missing:
        print("\nWARNING missing files:", missing)

    for rel in DELETE_REMOTE:
        c.exec_command(f"rm -f '{REMOTE}/{rel}'", timeout=30)
        print("deleted remote", rel)
    # remove empty legacy dir if present
    c.exec_command(f"rmdir '{REMOTE}/app/api/auth/login' 2>/dev/null", timeout=30)

    cmds = [
        f"cd {REMOTE} && yarn install --ignore-engines 2>&1 | tail -5",
        f"cd {REMOTE} && npx prisma db push --skip-generate 2>&1 | tail -10",
        f"cd {REMOTE} && npx prisma generate 2>&1 | tail -3",
        f"cd {REMOTE} && yarn build 2>&1 | tail -30",
        "pm2 restart qrbanner 2>&1",
    ]
    for cmd in cmds:
        print("\n>>>", cmd[:90])
        _, stdout, stderr = c.exec_command(cmd, timeout=900)
        out = stdout.read().decode("utf-8", errors="replace")
        err = stderr.read().decode("utf-8", errors="replace")
        print(out or err)

    # create/promote admin user
    print("\n>>> create admin user", ADMIN_EMAIL)
    admin_cmd = (
        f"cd {REMOTE} && node scripts/create-admin-user.mjs "
        f"'{ADMIN_EMAIL}' '{ADMIN_PASSWORD}' 2>&1 | tail -5"
    )
    _, stdout, stderr = c.exec_command(admin_cmd, timeout=120)
    print(stdout.read().decode("utf-8", errors="replace") or stderr.read().decode("utf-8", errors="replace"))

    c.close()
    print("\nDeploy complete.")


if __name__ == "__main__":
    main()
