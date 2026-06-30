#!/usr/bin/env python3
"""Add Google OAuth client ID to production .env and deploy auth UI."""
import os
import re
import paramiko
import time

HOST = "31.97.113.170"
USER = "root"
PASSWORD = "112358Onrks.."
LOCAL = r"C:\Users\ACRO Technology\qrbanner"
REMOTE = "/var/www/qrbanner"
GOOGLE_CLIENT_ID = "643750634751-gbh30snqbjfhorbe40gti27md4qhvh9k.apps.googleusercontent.com"

AUTH_FILES = [
    "components/auth/oauth-buttons.tsx",
    "components/auth/signup-form.tsx",
    "components/auth/login-form.tsx",
    "app/(auth)/signup/page.tsx",
]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)

# Read .env
sftp = c.open_sftp()
try:
    with sftp.open(f"{REMOTE}/.env", "r") as f:
        env_content = f.read().decode("utf-8", errors="replace")
except FileNotFoundError:
    env_content = ""

def set_env_var(content: str, key: str, value: str) -> str:
    line = f'{key}="{value}"'
    pattern = rf"^{re.escape(key)}=.*$"
    if re.search(pattern, content, re.MULTILINE):
        return re.sub(pattern, line, content, flags=re.MULTILINE)
    if content and not content.endswith("\n"):
        content += "\n"
    return content + line + "\n"

env_content = set_env_var(env_content, "GOOGLE_CLIENT_ID", GOOGLE_CLIENT_ID)
has_secret = bool(re.search(r'^GOOGLE_CLIENT_SECRET=.+\S', env_content, re.MULTILINE))

with sftp.open(f"{REMOTE}/.env", "w") as f:
    f.write(env_content)
print("GOOGLE_CLIENT_ID set on VPS")
print("GOOGLE_CLIENT_SECRET present:", has_secret)

for rel in AUTH_FILES:
    local = os.path.join(LOCAL, rel)
    remote = f"{REMOTE}/{rel.replace(chr(92), '/')}"
    c.exec_command(f"mkdir -p '{os.path.dirname(remote)}'", timeout=30)
    sftp.put(local, remote)
    print("uploaded", rel)
sftp.close()

if has_secret:
    o = c.exec_command(f"cd {REMOTE} && yarn build 2>&1 | tail -5", timeout=900)[1].read().decode("ascii", errors="replace")
    print(o)
    c.exec_command("pm2 restart qrbanner", timeout=60)
    time.sleep(4)
    providers = c.exec_command("curl -s https://qrbanner.com/api/auth/providers", timeout=30)[1].read().decode()
    print("providers:", providers)
else:
    c.exec_command("pm2 restart qrbanner", timeout=60)
    print("Skipped build — add GOOGLE_CLIENT_SECRET then restart")

c.close()
