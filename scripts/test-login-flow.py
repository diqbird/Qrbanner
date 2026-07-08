#!/usr/bin/env python3
"""Test full NextAuth credentials flow with cookies."""
import paramiko
import json
import re
import os

HOST = "31.97.113.170"
USER = "root"
PASSWORD = os.environ["DEPLOY_PASSWORD"]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)

def run(cmd):
    i, o, e = c.exec_command(cmd, timeout=60)
    return o.read().decode("utf-8", errors="replace") + e.read().decode("utf-8", errors="replace")

# cookie jar flow
script = r'''
COOKIE_JAR=/tmp/qrb_cookies.txt
rm -f $COOKIE_JAR

echo "=== GET csrf ==="
CSRF_RESP=$(curl -s -c $COOKIE_JAR -b $COOKIE_JAR 'https://qrbanner.com/api/auth/csrf')
echo "$CSRF_RESP"
CSRF=$(echo "$CSRF_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['csrfToken'])")

echo "=== POST credentials ==="
SIGNIN=$(curl -s -c $COOKIE_JAR -b $COOKIE_JAR -w '\nHTTP:%{http_code}' \
  -X POST 'https://qrbanner.com/api/auth/callback/credentials' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d "csrfToken=$CSRF&email=john%40doe.com&password=johndoe123&redirect=false&json=true")
echo "$SIGNIN"

echo "=== Session check ==="
SESSION=$(curl -s -b $COOKIE_JAR 'https://qrbanner.com/api/auth/session')
echo "$SESSION"

echo "=== Cookies ==="
cat $COOKIE_JAR
'''
print(run(script))

# Check NEXTAUTH_URL exact value
print("=== NEXTAUTH_URL ===")
print(run("grep NEXTAUTH_URL /var/www/qrbanner/.env"))

# Check if OAuth vars exist
print("=== OAuth env ===")
print(run("grep -E 'GOOGLE_|GITHUB_|AZURE_' /var/www/qrbanner/.env || echo 'NONE'"))

c.close()
