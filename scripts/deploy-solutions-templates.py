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
    "app/s/[code]/route.ts",
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
