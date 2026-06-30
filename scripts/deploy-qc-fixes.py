#!/usr/bin/env python3
"""Deploy QC fixes: demo form, logo, CLS, QR description toggle, i18n."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

FILES = [
    "app/(public)/page.tsx",
    "app/api/contact/inquiry/route.ts",
    "components/brand/site-logo.tsx",
    "components/public-header.tsx",
    "components/public-footer.tsx",
    "components/public/pricing-page-content.tsx",
    "components/landing/pricing-section.tsx",
    "components/landing/section-skeleton.tsx",
    "components/marketing/sales-inquiry-form.tsx",
    "components/qr/editable-frame-label.tsx",
    "components/qr/frame-label-settings.tsx",
    "components/qr/qr-preview.tsx",
    "components/qr/qr-edit-view.tsx",
    "components/qr/style-template-library.tsx",
    "components/dashboard/webhook-settings.tsx",
    "components/dashboard/api-key-settings.tsx",
    "components/dashboard/custom-domain-settings.tsx",
    "components/dashboard/folder-manager.tsx",
    "lib/marketing-config.ts",
    "lib/qr-style.ts",
    "lib/qr-render.ts",
    "lib/sales-inquiry-email.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "scripts/.env.marketing.example",
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


missing = [f for f in FILES if not os.path.isfile(os.path.join(LOCAL, f))]
if missing:
    print("ERROR: missing local files:", file=sys.stderr)
    for f in missing:
        print(" ", f, file=sys.stderr)
    sys.exit(1)

print(f"Uploading {len(FILES)} QC fix files...")
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

_, o, _ = c.exec_command(
    f"cd {REMOTE} && yarn build > /tmp/qrb-qc-fixes.log 2>&1; echo EXIT:$?; tail -50 /tmp/qrb-qc-fixes.log",
    timeout=600,
)
out = o.read().decode("utf-8", errors="replace")
with open(os.path.join(LOCAL, "scripts", "_deploy_qc_fixes.txt"), "w", encoding="utf-8") as f:
    f.write(out)
_, o, _ = c.exec_command(f"cd {REMOTE} && pm2 restart qrbanner 2>/dev/null; echo done", timeout=30)
c.close()
if "EXIT:0" not in out:
    print("BUILD FAILED")
    print(out.encode("ascii", errors="replace").decode("ascii"))
    sys.exit(1)
print("deploy ok")
