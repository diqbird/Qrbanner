#!/usr/bin/env python3
"""Deploy UX/copy improvements to production."""
import os
import paramiko
import time

HOST = "31.97.113.170"
USER = "root"
PASSWORD = "112358Onrks.."
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"

FILES = [
    "lib/qr-utils.ts",
    "lib/site-content.ts",
    "lib/seo.ts",
    "lib/landing-page.ts",
    "lib/industry-templates.ts",
    "components/qr/category-fields.tsx",
    "components/qr/qr-create-wizard.tsx",
    "components/qr/industry-template-picker.tsx",
    "components/qr/industry-template-guide.tsx",
    "components/qr/geofence-settings.tsx",
    "components/qr/landing-page-editor.tsx",
    "components/qr/scannability-panel.tsx",
    "components/qr/ab-test-settings.tsx",
    "components/qr/qr-edit-view.tsx",
    "components/dashboard/dashboard-content.tsx",
    "components/landing/hero.tsx",
    "components/public-footer.tsx",
    "app/(public)/page.tsx",
    "app/(public)/qr/create/page.tsx",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local = os.path.join(LOCAL, rel)
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    c.exec_command(f"mkdir -p '{os.path.dirname(remote).replace(chr(92), '/')}'", timeout=30)
    sftp.put(local, remote)
    print("ok", rel)
sftp.close()

o = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -12", timeout=900)[1].read().decode("ascii", errors="replace")
open(os.path.join(LOCAL, "build-out.txt"), "w", encoding="utf-8").write(o)
print(o)
if "Failed to compile" in o:
    c.close()
    raise SystemExit(1)
c.exec_command("pm2 restart qrbanner", timeout=60)
time.sleep(4)
c.close()
print("DONE")
