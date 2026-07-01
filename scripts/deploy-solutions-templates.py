#!/usr/bin/env python3
"""Deploy solutions template linking (Faz 0 + Faz 1 P0)."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

FILES = [
    "lib/solutions.ts",
    "lib/industry-templates.ts",
    "lib/industry-archetype-templates.ts",
    "lib/industry-print-layouts.ts",
    "lib/template-design-standards.ts",
    "lib/visual-qr-presets.ts",
    "lib/qr-style.ts",
    "lib/qr-render.ts",
    "lib/print-banner.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "lib/i18n/industry-template-copy.ts",
    "lib/i18n/core-template-copy-extra.ts",
    "lib/i18n/template-meta-copy.ts",
    "lib/i18n/template-cta-copy.ts",
    "lib/i18n/template-print-copy.ts",
    "lib/i18n/print-template-copy.ts",
    "lib/i18n/resolve-print-copy.ts",
    "lib/i18n/resolve-landing-copy.ts",
    "lib/i18n/resolve-template-copy.ts",
    "components/qr/landing-page-editor.tsx",
    "components/qr/landing-page-preview.tsx",
    "lib/landing-page.ts",
    "lib/landing-cta-analytics.ts",
    "lib/landing-cta-beacon.ts",
    "app/api/landing-cta/route.ts",
    "app/api/leads/route.ts",
    "lib/rate-limit-store.ts",
    "lib/redis-client.ts",
    "lib/scan-redirect-cache.ts",
    "app/s/[code]/route.ts",
    "app/api/qr/[id]/route.ts",
    "app/api/v1/qr/[id]/route.ts",
    "app/api/qr/bulk-actions/route.ts",
    "components/qr/qr-preview.tsx",
    "components/qr/print-banner-export.tsx",
    "components/qr/qr-create-wizard.tsx",
    "components/qr/qr-preview.tsx",
    "components/qr/editable-frame-label.tsx",
    "components/qr/frame-label-settings.tsx",
    "components/qr/print-banner-export.tsx",
    "components/qr/qr-style-editor.tsx",
    "components/qr/visual-preset-picker.tsx",
    "components/qr/template-section-fields.tsx",
    "components/qr/industry-template-guide.tsx",
    "components/qr/industry-template-picker.tsx",
    "lib/i18n/visual-preset-copy.ts",
    "lib/i18n/resolve-visual-preset-copy.ts",
    "components/solutions/solution-detail-shell.tsx",
    "components/dashboard/dashboard-analytics.tsx",
    "components/qr/analytics-charts.tsx",
    "components/qr/qr-analytics-view.tsx",
    "lib/analytics-utils.ts",
    "lib/analytics-range.ts",
    "lib/analytics-comparison.ts",
    "components/analytics/period-change-badge.tsx",
    "app/api/dashboard/analytics/route.ts",
    "app/api/qr/[id]/analytics/route.ts",
    "components/qr/landing-cta-analytics-panel.tsx",
    "components/qr/qr-analytics-view.tsx",
    "lib/admin-billing-stats.ts",
    "lib/admin-audit.ts",
    "app/api/admin/audit-log/route.ts",
    "app/api/admin/users/route.ts",
    "app/api/admin/site-settings/route.ts",
    "app/api/admin/blog/route.ts",
    "app/api/admin/blog/[id]/route.ts",
    "components/admin/admin-audit-panel.tsx",
    "components/admin/admin-content.tsx",
    "app/api/admin/stats/route.ts",
    "app/api/admin/users/route.ts",
    "components/admin/admin-content.tsx",
    "components/admin/admin-billing-panel.tsx",
    "lib/template-marketplace.ts",
    "lib/aws-config.ts",
    "lib/s3.ts",
    "lib/storage.ts",
    "app/api/upload/route.ts",
    "lib/workspace-sso.ts",
    "lib/saml-sp.ts",
    "lib/saml-auth.ts",
    "lib/auth-options.ts",
    "lib/totp.ts",
    "app/api/auth/mfa/route.ts",
    "app/api/auth/mfa/setup/route.ts",
    "app/api/auth/mfa/enable/route.ts",
    "app/api/auth/mfa/disable/route.ts",
    "app/api/auth/mfa/verify-session/route.ts",
    "app/(auth)/mfa-verify/page.tsx",
    "components/auth/mfa-verify-form.tsx",
    "components/auth/login-form.tsx",
    "components/dashboard/mfa-settings.tsx",
    "components/dashboard/settings-content.tsx",
    "middleware.ts",
    "app/api/auth/saml/metadata/route.ts",
    "app/api/auth/saml/login/route.ts",
    "app/api/auth/saml/acs/route.ts",
    "app/api/auth/saml/info/route.ts",
    "app/api/workspace/members/route.ts",
    "app/api/invite/[token]/route.ts",
    "components/dashboard/team-workspace-settings.tsx",
    "components/auth/login-form.tsx",
    "prisma/schema.prisma",
    "lib/webhooks.ts",
    "lib/webhook-deliveries.ts",
    "lib/openapi-spec.ts",
    "app/api/openapi.json/route.ts",
    "app/api/webhooks/deliveries/route.ts",
    "components/dashboard/webhook-settings.tsx",
    "app/(public)/developers/page.tsx",
    "components/templates/template-marketplace-grid.tsx",
    "components/templates/template-detail-shell.tsx",
    "app/(public)/templates/page.tsx",
    "app/(public)/templates/[id]/page.tsx",
    "components/public-header.tsx",
    "components/public-footer.tsx",
    "app/sitemap.ts",
    "middleware.ts",
    "lib/i18n/locale-path.ts",
    "lib/i18n/server.ts",
    "lib/i18n/index.ts",
    "components/i18n/language-provider.tsx",
    "components/i18n/use-locale-path.ts",
    "components/public-header.tsx",
    "components/public-footer.tsx",
    "app/layout.tsx",
    "package.json",
    "yarn.lock",
]

if not PW:
    print("ERROR: Set DEPLOY_PASSWORD", file=sys.stderr)
    sys.exit(1)


def ensure_remote_dir(sftp, remote_dir: str) -> None:
    parts = remote_dir.replace("\\", "/").strip("/").split("/")
    path = ""
    for part in parts:
        path += "/" + part
        try:
            sftp.stat(path)
        except OSError:
            sftp.mkdir(path)


c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local_path = os.path.join(LOCAL, rel)
    remote_path = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    ensure_remote_dir(sftp, os.path.dirname(remote_path).replace("\\", "/"))
    sftp.put(local_path, remote_path)
    print("ok", rel)
sftp.close()

_, stdout_deps, _ = c.exec_command(
    f"cd {REMOTE} && yarn install --frozen-lockfile --ignore-engines 2>&1 | tail -8",
    timeout=300,
)
deps_out = stdout_deps.read().decode("utf-8", errors="replace")
print("yarn install:", (deps_out.strip() or "ok").encode("ascii", errors="replace").decode("ascii"))

_, stdout_db, _ = c.exec_command(
    f"cd {REMOTE} && npx prisma generate && npx prisma db push --skip-generate 2>&1 | tail -10",
    timeout=180,
)
db_out = stdout_db.read().decode("utf-8", errors="replace")
print("db push:", (db_out.strip() or "ok").encode("ascii", errors="replace").decode("ascii"))

_, stdout, _ = c.exec_command(
    f"cd {REMOTE} && yarn build > /tmp/qrb-solutions-templates.log 2>&1; echo EXIT:$?; tail -12 /tmp/qrb-solutions-templates.log",
    timeout=600,
)
out = stdout.read().decode("utf-8", errors="replace")
c.exec_command(f"cd {REMOTE} && pm2 restart qrbanner", timeout=30)
c.close()

log_path = os.path.join(LOCAL, "scripts", "deploy-solutions-templates-last.log")
with open(log_path, "w", encoding="utf-8") as f:
    f.write(out)

if "EXIT:0" not in out:
    print("BUILD FAILED")
    print(out)
    sys.exit(1)
print("deploy ok")
