#!/usr/bin/env python3
"""Enable HTTP/2 on the qrbanner nginx server block (safe: backup, test, rollback)."""
import os, sys, paramiko

PW = os.environ.get("DEPLOY_PASSWORD")
if not PW:
    print("Set DEPLOY_PASSWORD", file=sys.stderr); sys.exit(1)

CONF = "/etc/nginx/sites-available/qrbanner"

CMD = f"""
set -e
CONF={CONF}
BK="$CONF.bak.$(date +%s)"
cp "$CONF" "$BK"
echo "Backup: $BK"

# nginx 1.24 enables HTTP/2 via the listen parameter: 'listen 443 ssl http2;'
if grep -q "listen 443 ssl http2;" "$CONF"; then
  echo "http2 already enabled"
else
  sed -i 's/listen 443 ssl;/listen 443 ssl http2;/' "$CONF"
  echo "Enabled http2 on listen 443"
fi

echo "=== new config (grep) ==="
grep -n "listen\\|http2" "$CONF"

echo "=== nginx -t ==="
if nginx -t; then
  systemctl reload nginx
  echo "RELOADED_OK"
else
  echo "TEST FAILED - restoring backup"
  cp "$BK" "$CONF"
  echo "RESTORED"
  exit 1
fi
"""
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password=PW, timeout=30)
i, o, e = c.exec_command(CMD, timeout=90)
print(o.read().decode("utf-8", "replace"))
err = e.read().decode("utf-8", "replace")
if err.strip():
    print("STDERR:\n", err)
c.close()
