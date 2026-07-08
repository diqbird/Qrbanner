#!/usr/bin/env python3
"""Set NEXT_PUBLIC_GA_MEASUREMENT_ID on VPS .env and deploy GA component."""
import os
import re
import sys
import paramiko

HOST, USER, PW = "31.97.113.170", "root", os.environ["DEPLOY_PASSWORD"]
LOCAL, REMOTE = r"C:\Users\ACRO Technology\qrbanner", "/var/www/qrbanner"

FILES = [
    "app/layout.tsx",
    "components/analytics/site-google-analytics.tsx",
]

def parse_ga_id():
    for arg in sys.argv[1:]:
        if arg.startswith("GA_ID=") or arg.startswith("NEXT_PUBLIC_GA_MEASUREMENT_ID="):
            return arg.split("=", 1)[1].strip()
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
    ga_id = parse_ga_id()
    if not ga_id:
        print("Usage: python configure-ga.py GA_ID=G-XXXXXXXXXX")
        raise SystemExit(1)

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
    env_content = set_env_var(env_content, "NEXT_PUBLIC_GA_MEASUREMENT_ID", ga_id.upper())
    with sftp.open(f"{REMOTE}/.env", "w") as f:
        f.write(env_content)
    sftp.close()

    o = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -8", timeout=900)[1].read().decode("ascii", errors="replace")
    print(o.encode("ascii", errors="replace").decode("ascii"))
    if "Failed to compile" in o:
        raise SystemExit(1)
    c.exec_command("pm2 restart qrbanner", timeout=60)
    c.close()
    print("GA4 configured:", ga_id.upper())

if __name__ == "__main__":
    main()
