#!/usr/bin/env python3
"""Diagnose login issues on production."""
import paramiko
import json
import os

HOST = "31.97.113.170"
USER = "root"
PASSWORD = os.environ["DEPLOY_PASSWORD"]
REMOTE = "/var/www/qrbanner"

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)

def run(cmd, timeout=60):
    i, o, e = c.exec_command(cmd, timeout=timeout)
    out = o.read().decode("utf-8", errors="replace")
    err = e.read().decode("utf-8", errors="replace")
    return out + err

print("=== ENV (auth-related, masked) ===")
env = run(f"grep -E 'NEXTAUTH|GOOGLE_|GITHUB_|AZURE_' {REMOTE}/.env 2>/dev/null || true")
for line in env.strip().splitlines():
    if "=" in line:
        k, v = line.split("=", 1)
        v = v.strip().strip('"').strip("'")
        if v:
            print(f"{k}=***set({len(v)} chars)***")
        else:
            print(f"{k}=EMPTY")
    else:
        print(line)

print("\n=== PM2 logs (last auth errors) ===")
logs = run("pm2 logs qrbanner --lines 80 --nostream 2>&1")
for line in logs.splitlines():
    low = line.lower()
    if any(x in low for x in ["error", "auth", "nextauth", "credentials", "oauth", "login"]):
        print(line[:200])

print("\n=== Test NextAuth CSRF ===")
print(run("curl -sI 'https://qrbanner.com/api/auth/csrf' | head -5"))

print("\n=== Test credentials signin (john@doe.com) ===")
# Get CSRF token
csrf_raw = run("curl -s 'https://qrbanner.com/api/auth/csrf'")
try:
    csrf = json.loads(csrf_raw.strip().split("\n")[-1])["csrfToken"]
    print("CSRF token obtained:", csrf[:20] + "...")
    signin = run(
        f"""curl -s -w '\\nHTTP_CODE:%{{http_code}}' -X POST 'https://qrbanner.com/api/auth/callback/credentials' \\
  -H 'Content-Type: application/x-www-form-urlencoded' \\
  -d 'csrfToken={csrf}&email=john%40doe.com&password=johndoe123&redirect=false&json=true'"""
    )
    print(signin[:500])
except Exception as ex:
    print("CSRF/signin test failed:", ex, "raw:", csrf_raw[:300])

print("\n=== Test OAuth providers list ===")
print(run("curl -s 'https://qrbanner.com/api/auth/providers'"))

print("\n=== DB user john@doe.com ===")
db = run(
    f"""cd {REMOTE} && node -e "
const {{ PrismaClient }} = require('@prisma/client');
const p = new PrismaClient();
p.user.findUnique({{ where: {{ email: 'john@doe.com' }}, select: {{ id: true, email: true, emailVerified: true, password: true }} }})
  .then(u => {{ console.log(JSON.stringify({{ ...u, hasPassword: !!u?.password }})); }})
  .finally(() => p.\\$disconnect());
" 2>&1"""
)
print(db)

c.close()
