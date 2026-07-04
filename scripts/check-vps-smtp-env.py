#!/usr/bin/env python3
"""Print VPS SMTP env (no secrets)."""
import os
import sys
import paramiko

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD", "112358Onrks..")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")
KEYS = ("SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_FROM", "SMTP_SECURE")

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
_, stdout, _ = c.exec_command(f"grep -E '^({'|'.join(KEYS)})=' {REMOTE}/.env 2>/dev/null || true")
lines = [ln.strip() for ln in stdout.read().decode("utf-8", errors="replace").splitlines() if ln.strip()]
c.close()

print("=== VPS SMTP env ===")
for ln in lines:
    print(f"  {ln}")

expected = {"SMTP_USER": "noreply@qrbanner.com", "SMTP_FROM": "noreply@qrbanner.com"}
vals = {}
for ln in lines:
    k, _, v = ln.partition("=")
    vals[k] = v.strip().strip('"').strip("'")

ok = True
for k, exp in expected.items():
    got = vals.get(k, "")
    if got == exp:
        print(f"  [OK] {k}={got}")
    else:
        print(f"  [WARN] {k}={got or '(missing)'} — expected {exp}")
        ok = False

print("=== Result:", "PASS" if ok else "CHECK .env ===")
raise SystemExit(0 if ok else 1)
