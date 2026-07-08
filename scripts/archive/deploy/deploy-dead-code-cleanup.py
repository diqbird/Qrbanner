#!/usr/bin/env python3
"""Deploy dead-code cleanup: package.json prune + removed component/lib files."""
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

UPLOAD = [
    "package.json",
    "yarn.lock",
]

REMOVE = [
    "components/analytics/site-google-analytics.tsx",
    "components/analytics/site-google-tag-manager.tsx",
    "components/layouts/app-shell.tsx",
    "components/layouts/auth-layout.tsx",
    "components/layouts/page-header.tsx",
    "components/ui/accordion.tsx",
    "components/ui/alert-dialog.tsx",
    "components/ui/alert.tsx",
    "components/ui/animate.tsx",
    "components/ui/aspect-ratio.tsx",
    "components/ui/avatar.tsx",
    "components/ui/breadcrumb.tsx",
    "components/ui/carousel.tsx",
    "components/ui/context-menu.tsx",
    "components/ui/drawer.tsx",
    "components/ui/form.tsx",
    "components/ui/hover-card.tsx",
    "components/ui/input-otp.tsx",
    "components/ui/menubar.tsx",
    "components/ui/navigation-menu.tsx",
    "components/ui/pagination.tsx",
    "components/ui/radio-group.tsx",
    "components/ui/resizable.tsx",
    "components/ui/scroll-area.tsx",
    "components/ui/sheet.tsx",
    "components/ui/task-card.tsx",
    "components/ui/toast.tsx",
    "components/ui/toaster.tsx",
    "components/ui/toggle-group.tsx",
    "components/ui/toggle.tsx",
    "components/ui/tooltip.tsx",
    "components/ui/use-toast.ts",
    "lib/session-guard.ts",
    "lib/types.ts",
    "hooks/use-toast.ts",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()

for rel in UPLOAD:
    sftp.put(os.path.join(LOCAL, rel), f"{REMOTE}/{rel}")
    print("ok upload", rel)

for rel in REMOVE:
    remote = f"{REMOTE}/{rel}"
    try:
        sftp.remove(remote)
        print("ok remove", rel)
    except FileNotFoundError:
        print("skip remove (missing)", rel)
    except OSError as e:
        print("warn remove", rel, e)

sftp.close()

cmds = (
    f"cd {REMOTE} && yarn install --frozen-lockfile 2>&1 | tail -8 && "
    f"yarn build 2>&1 | tail -15 && "
    "pm2 restart qrbanner 2>&1 | tail -2"
)
_, stdout, stderr = c.exec_command(cmds, timeout=900)
out = stdout.read().decode("utf-8", errors="replace")
print(out)
err = stderr.read().decode("utf-8", errors="replace")
if err.strip():
    print("stderr:", err[-800:])
c.close()
print("Dead-code cleanup deployed.")
