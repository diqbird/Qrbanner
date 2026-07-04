#!/usr/bin/env python3
"""Upload smtp-test-on-vps.mjs and run it on the VPS."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")
LOCAL = os.path.join(os.path.dirname(__file__), "smtp-test-on-vps.mjs")
TEST_TO = sys.argv[1] if len(sys.argv) > 1 else ""

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)
sftp = c.open_sftp()
sftp.put(LOCAL, f"{REMOTE}/scripts/smtp-test-on-vps.mjs")
sftp.close()

env_prefix = f"TEST_TO='{TEST_TO}' " if TEST_TO else ""
_, stdout, stderr = c.exec_command(
    f"cd {REMOTE} && {env_prefix}node scripts/smtp-test-on-vps.mjs", timeout=60
)
print(stdout.read().decode("utf-8", "replace"))
err = stderr.read().decode("utf-8", "replace")
if err.strip():
    print("stderr:", err)
c.close()
