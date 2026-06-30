#!/usr/bin/env python3
"""Run Playwright E2E on VPS (local Windows may lack Node)."""
import os
import re
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")
LOCAL = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")

if not PW:
    print("ERROR: Set DEPLOY_PASSWORD", file=sys.stderr)
    sys.exit(1)

CMD = f"""
cd {REMOTE}
export PLAYWRIGHT_BASE_URL=https://qrbanner.com
export CI=true
npx playwright test 2>&1
echo EXIT:$?
"""

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
print("Running Playwright on VPS...")

# Upload latest e2e specs
sftp = c.open_sftp()
for rel in ["e2e/smoke.spec.ts", "e2e/qr-categories.spec.ts"]:
    sftp.put(os.path.join(LOCAL, rel), f"{REMOTE}/{rel}")
sftp.close()

_, stdout, stderr = c.exec_command(CMD, timeout=900)
out = stdout.read().decode("utf-8", errors="replace")
err = stderr.read().decode("utf-8", errors="replace")
log = os.path.join(LOCAL, "scripts", "e2e-run-last.log")
with open(log, "w", encoding="utf-8") as f:
    f.write(out)
    if err:
        f.write("\n--- stderr ---\n")
        f.write(err)
c.close()

lines = out.splitlines()
for line in lines[-25:]:
    print(line.encode("ascii", errors="replace").decode("ascii"))
print(f"\nFull log: {log}")

failed_m = re.search(r"(\d+)\s+failed", out)
passed_m = re.search(r"(\d+)\s+passed", out)
if passed_m and (not failed_m or int(failed_m.group(1)) == 0):
    print(f"\nOK: {passed_m.group(1)} tests passed")
    sys.exit(0)
sys.exit(1)
