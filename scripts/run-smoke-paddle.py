#!/usr/bin/env python3
"""Upload smoke-paddle-on-vps.mjs to the VPS and run it against live Paddle."""
import os
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

LOCAL = os.path.join(os.path.dirname(__file__), "smoke-paddle-on-vps.mjs")


def main():
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username=USER, password=PW, timeout=30)
    sftp = c.open_sftp()
    sftp.put(LOCAL, f"{REMOTE}/scripts/smoke-paddle-on-vps.mjs")
    sftp.close()

    _, stdout, stderr = c.exec_command(
        f"cd {REMOTE} && node scripts/smoke-paddle-on-vps.mjs", timeout=90
    )
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    c.close()
    print(out)
    if err.strip():
        print("--- stderr ---")
        print(err)


if __name__ == "__main__":
    main()
