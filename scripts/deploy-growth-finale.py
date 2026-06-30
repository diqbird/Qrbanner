#!/usr/bin/env python3
"""Deploy Growth Pack FINALE: all metadata i18n + content targets 50/50/50/60."""
import glob
import os
import re
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

_extra: set[str] = set()
for path in sorted(glob.glob(os.path.join(SCRIPT_DIR, "deploy-growth-v*.py"))):
    text = open(path, encoding="utf-8").read()
    if "FILES = [" not in text:
        continue
    for m in re.findall(r'"([^"]+)"', text.split("FILES = [", 1)[-1].split("]", 1)[0]):
        if "/" in m or m.endswith((".ts", ".tsx", ".css", ".js", ".svg")):
            _extra.add(m)

for path in glob.glob(os.path.join(LOCAL, "lib", "blog", "posts", "*.ts")):
    rel = os.path.relpath(path, LOCAL).replace("\\", "/")
    _extra.add(rel)

for path in glob.glob(os.path.join(LOCAL, "public", "logos", "*.svg")):
    rel = os.path.relpath(path, LOCAL).replace("\\", "/")
    _extra.add(rel)

FINALE_EXTRA = [
    "app/(public)/solutions/page.tsx",
    "app/(public)/vs/page.tsx",
    "app/(public)/qr-types/page.tsx",
    "app/(public)/case-studies/page.tsx",
    "app/(public)/integrations/page.tsx",
    "app/(public)/integrations/zapier/page.tsx",
    "app/(public)/affiliates/page.tsx",
    "app/(public)/referral/page.tsx",
    "app/(public)/customers/page.tsx",
    "app/(public)/demo/page.tsx",
    "app/(public)/enterprise/page.tsx",
    "app/(public)/security/page.tsx",
    "app/(public)/roi-calculator/page.tsx",
    "app/(public)/qr/create/page.tsx",
    "app/(public)/reviews/page.tsx",
    "app/(public)/reviews/g2-setup/page.tsx",
    "app/(public)/reviews/prompts/page.tsx",
    "app/(public)/brand/logos/page.tsx",
    "app/(public)/downloads/enterprise-overview/page.tsx",
    "app/sitemap.ts",
]
_extra.update(FINALE_EXTRA)
FILES = sorted(_extra)

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

print(f"Uploading {len(FILES)} files (FINALE)...")
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
    f"cd {REMOTE} && yarn build > /tmp/qrb-growth-finale.log 2>&1; echo EXIT:$?; tail -50 /tmp/qrb-growth-finale.log",
    timeout=600,
)
out = o.read().decode("utf-8", errors="replace")
with open(os.path.join(LOCAL, "scripts", "_deploy_growth_finale.txt"), "w", encoding="utf-8") as f:
    f.write(out)
_, o, _ = c.exec_command(f"cd {REMOTE} && pm2 restart qrbanner 2>/dev/null; echo done", timeout=30)
c.close()
if "EXIT:0" not in out:
    print("BUILD FAILED")
    print(out.encode("ascii", errors="replace").decode("ascii"))
    sys.exit(1)
print("deploy ok")
