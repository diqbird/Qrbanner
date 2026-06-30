#!/usr/bin/env python3
"""Deploy Growth Pack v21: Zapier i18n, index JsonLd, +2 content each."""
import glob
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

FILES = [
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
    "app/(public)/integrations/zapier/page.tsx",
    "app/(public)/solutions/page.tsx",
    "app/(public)/vs/page.tsx",
    "app/(public)/qr-types/page.tsx",
    "lib/solutions.ts",
    "lib/solution-icons.ts",
    "lib/case-studies.ts",
    "lib/competitor-pages.ts",
    "lib/blog/posts-service.ts",
    "lib/blog/posts/optometry-practice-qr.ts",
    "lib/blog/posts/childcare-enrollment-qr.ts",
    "app/sitemap.ts",
]
for path in glob.glob(os.path.join(LOCAL, "lib", "blog", "posts", "*.ts")):
    rel = os.path.relpath(path, LOCAL).replace("\\", "/")
    if rel not in FILES:
        FILES.append(rel)

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


print(f"Uploading {len(FILES)} files...")
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
    f"cd {REMOTE} && yarn build > /tmp/qrb-growth21.log 2>&1; echo EXIT:$?; tail -40 /tmp/qrb-growth21.log",
    timeout=600,
)
out = o.read().decode("utf-8", errors="replace")
with open(os.path.join(LOCAL, "scripts", "_deploy_growth21.txt"), "w", encoding="utf-8") as f:
    f.write(out)
_, o, _ = c.exec_command(f"cd {REMOTE} && pm2 restart qrbanner 2>/dev/null; echo done", timeout=30)
c.close()
if "EXIT:0" not in out:
    print("BUILD FAILED")
    print(out.encode("ascii", errors="replace").decode("ascii"))
    sys.exit(1)
print("deploy ok")
