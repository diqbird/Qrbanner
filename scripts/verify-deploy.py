#!/usr/bin/env python3
"""Upload changed files and run production build on VPS."""
import os
import paramiko

HOST = "31.97.113.170"
USER = "root"
PASSWORD = "112358Onrks.."
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"

FILES = [
    "lib/industry-templates.ts",
    "lib/qr-utils.ts",
    "lib/analytics-utils.ts",
    "lib/auth-options.ts",
    "lib/qr-style.ts",
    "lib/scannability.ts",
    "lib/qr-ai.ts",
    "lib/optimization-insights.ts",
    "lib/rate-limit.ts",
    "lib/site-content.ts",
    "prisma/schema.prisma",
    "next.config.js",
    "components/qr/category-fields.tsx",
    "components/qr/template-section-fields.tsx",
    "components/qr/industry-template-picker.tsx",
    "components/qr/industry-template-guide.tsx",
    "components/qr/qr-create-wizard.tsx",
    "components/qr/qr-edit-view.tsx",
    "components/qr/qr-preview.tsx",
    "components/qr/qr-style-editor.tsx",
    "components/qr/analytics-charts.tsx",
    "components/qr/qr-analytics-view.tsx",
    "components/qr/scannability-panel.tsx",
    "components/qr/ai-design-assistant.tsx",
    "components/qr/mockup-preview.tsx",
    "components/qr/scan-simulation.tsx",
    "components/qr/optimization-insights-panel.tsx",
    "components/dashboard/dashboard-content.tsx",
    "components/auth/login-form.tsx",
    "app/api/qr/route.ts",
    "app/api/qr/[id]/route.ts",
    "app/api/qr/bulk-actions/route.ts",
    "app/api/v1/qr/route.ts",
    "app/api/v1/qr/[id]/route.ts",
    "app/api/auth/login/route.ts",
    "app/s/[code]/route.ts",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)
sftp = c.open_sftp()
for rel in FILES:
    local = os.path.join(LOCAL, rel)
    if not os.path.isfile(local):
        print("SKIP missing", rel)
        continue
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    remote_dir = os.path.dirname(remote).replace(chr(92), '/')
    c.exec_command(f"mkdir -p {remote_dir}", timeout=30)
    sftp.put(local, remote)
    print("ok", rel)
sftp.close()

cmds = [
    f"cd {REMOTE} && yarn prisma generate && yarn prisma db push --accept-data-loss 2>&1 | tail -8",
    f"cd {REMOTE} && yarn build 2>&1 | tail -25",
]
for cmd in cmds:
    print(">>>", cmd.split("&&")[-1].strip())
    o = c.exec_command(cmd, timeout=900)[1].read().decode("utf-8", errors="replace")
    print(o.encode("ascii", errors="replace").decode())
    if "Failed to compile" in o:
        print("BUILD FAILED")
        c.close()
        raise SystemExit(1)

c.exec_command("pm2 restart qrbanner", timeout=60)
import time
time.sleep(5)
o = c.exec_command("curl -sI https://qrbanner.com/ | head -3", timeout=30)[1].read().decode()
print("SITE:", o.strip())
c.close()
print("DONE")
