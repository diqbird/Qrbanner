#!/usr/bin/env python3
"""Set NEXT_PUBLIC_GTM_ID on VPS .env and deploy GTM snippets."""
import os
import re
import sys
import paramiko

HOST, USER, PW = "31.97.113.170", "root", "112358Onrks.."
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"

FILES = [
    "app/layout.tsx",
    "components/analytics/site-google-tag-manager.tsx",
]

def parse_gtm_id():
    for arg in sys.argv[1:]:
        if arg.startswith("GTM_ID=") or arg.startswith("NEXT_PUBLIC_GTM_ID="):
            return arg.split("=", 1)[1].strip().upper()
    return None

def set_env_var(content: str, key: str, value: str) -> str:
    line = f'{key}="{value}"'
    pattern = rf"^{re.escape(key)}=.*$"
    if re.search(pattern, content, re.MULTILINE):
        return re.sub(pattern, line, content, flags=re.MULTILINE)
    if content and not content.endswith("\n"):
        content += "\n"
    return content + line + "\n"

def main():
    gtm_id = parse_gtm_id()
    if not gtm_id:
        print("Usage: python configure-gtm.py GTM_ID=GTM-XXXXXXX")
        raise SystemExit(1)
    if not gtm_id.startswith("GTM-"):
        gtm_id = f"GTM-{gtm_id}"

    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username=USER, password=PW, timeout=30)
    sftp = c.open_sftp()

    for rel in FILES:
        remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
        c.exec_command(f"mkdir -p '{os.path.dirname(remote)}'", timeout=30)
        sftp.put(os.path.join(LOCAL, rel), remote)
        print("ok", rel)

    with sftp.open(f"{REMOTE}/.env", "r") as f:
        env_content = f.read().decode("utf-8", errors="replace")
    env_content = set_env_var(env_content, "NEXT_PUBLIC_GTM_ID", gtm_id)
    with sftp.open(f"{REMOTE}/.env", "w") as f:
        f.write(env_content)
    sftp.close()

    o = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -8", timeout=900)[1].read().decode("ascii", errors="replace")
    print(o.encode("ascii", errors="replace").decode("ascii"))
    if "Failed to compile" in o:
        raise SystemExit(1)
    c.exec_command("pm2 restart qrbanner", timeout=60)
    c.close()
    print("GTM configured:", gtm_id)

if __name__ == "__main__":
    main()
