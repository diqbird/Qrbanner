#!/usr/bin/env python3
"""Deploy QA batch: SEO, security, 404/500, i18n."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

FILES = [
    "app/robots.ts",
    "app/sitemap.ts",
    "app/not-found.tsx",
    "app/error.tsx",
    "app/(public)/developers/page.tsx",
    "app/(auth)/invite/[token]/page.tsx",
    "components/public-header.tsx",
    "components/qr/qr-edit-view.tsx",
    "lib/security-headers.ts",
    "lib/i18n/en.ts",
    "lib/i18n/tr.ts",
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
    print("ERROR: missing:", missing, file=sys.stderr)
    sys.exit(1)

print(f"Uploading {len(FILES)} QA files...")
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
    f"cd {REMOTE} && yarn build > /tmp/qrb-qa.log 2>&1; echo EXIT:$?; tail -30 /tmp/qrb-qa.log",
    timeout=600,
)
out = o.read().decode("utf-8", errors="replace")
with open(os.path.join(LOCAL, "scripts", "_deploy_qa.txt"), "w", encoding="utf-8") as f:
    f.write(out)
c.exec_command(f"cd {REMOTE} && pm2 restart qrbanner", timeout=30)
c.close()
if "EXIT:0" not in out:
    print("BUILD FAILED")
    print(out.encode("ascii", errors="replace").decode("ascii"))
    sys.exit(1)
print("deploy ok")
