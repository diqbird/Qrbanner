#!/usr/bin/env python3
import os, sys, paramiko

PW = os.environ.get("DEPLOY_PASSWORD")
if not PW:
    print("Set DEPLOY_PASSWORD", file=sys.stderr); sys.exit(1)

CMD = r"""
echo "=== nginx version ==="
nginx -v 2>&1
echo "=== sites-enabled ==="
ls -la /etc/nginx/sites-enabled/ 2>/dev/null
echo "=== conf.d ==="
ls -la /etc/nginx/conf.d/ 2>/dev/null
echo "=== listen directives ==="
grep -rn "listen" /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null
echo "=== http2 / gzip / brotli in nginx.conf ==="
grep -rni "http2\|gzip\|brotli" /etc/nginx/nginx.conf 2>/dev/null
echo "=== http2 / gzip / brotli in sites ==="
grep -rni "http2\|gzip\|brotli" /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null
echo "=== ssl server block file(s) ==="
grep -rln "ssl_certificate" /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null
"""
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password=PW, timeout=30)
i, o, e = c.exec_command(CMD, timeout=60)
print(o.read().decode("utf-8", "replace"))
err = e.read().decode("utf-8", "replace")
if err.strip():
    print("STDERR:", err)
c.close()
