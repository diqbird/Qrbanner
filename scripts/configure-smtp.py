#!/usr/bin/env python3
"""Configure SMTP env vars on production VPS (.env). Usage:
  python configure-smtp.py SMTP_PASSWORD=your-mailbox-password
  python configure-smtp.py SMTP_HOST=smtp.hostinger.com SMTP_PORT=465 SMTP_USER=noreply@qrbanner.com SMTP_PASSWORD=secret
"""
import os
import re
import sys
import paramiko

HOST, USER, PW = "31.97.113.170", "root", os.environ["DEPLOY_PASSWORD"]
REMOTE = "/var/www/qrbanner"

DEFAULTS = {
    "SMTP_HOST": "smtp.hostinger.com",
    "SMTP_PORT": "587",
    "SMTP_SECURE": "false",
    "SMTP_USER": "noreply@qrbanner.com",
    "SMTP_FROM": "noreply@qrbanner.com",
}

def parse_args():
    overrides = {}
    for arg in sys.argv[1:]:
        if "=" in arg:
            k, v = arg.split("=", 1)
            overrides[k.strip()] = v.strip()
    return overrides

def set_env_var(content: str, key: str, value: str) -> str:
    line = f'{key}="{value}"'
    pattern = rf"^{re.escape(key)}=.*$"
    if re.search(pattern, content, re.MULTILINE):
        return re.sub(pattern, line, content, flags=re.MULTILINE)
    if content and not content.endswith("\n"):
        content += "\n"
    return content + line + "\n"

def main():
    overrides = parse_args()
    if not overrides.get("SMTP_PASSWORD"):
        print("ERROR: SMTP_PASSWORD required. Example:")
        print("  python configure-smtp.py SMTP_PASSWORD=your-password")
        raise SystemExit(1)

    values = {**DEFAULTS, **overrides}

    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username=USER, password=PW, timeout=30)
    sftp = c.open_sftp()
    try:
        with sftp.open(f"{REMOTE}/.env", "r") as f:
            env_content = f.read().decode("utf-8", errors="replace")
    except FileNotFoundError:
        env_content = ""

    for key in ["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM"]:
        if key in values and values[key]:
            env_content = set_env_var(env_content, key, values[key])

    with sftp.open(f"{REMOTE}/.env", "w") as f:
        f.write(env_content)
    sftp.close()
    c.exec_command("pm2 restart qrbanner", timeout=60)
    c.close()
    print("SMTP configured on VPS (password not shown). pm2 restarted.")

if __name__ == "__main__":
    main()
