#!/usr/bin/env python3
"""E2E: free plan QR limit via live REST API.

1. Creates an isolated test user (API key, plan=free) on the VPS via Prisma.
2. POSTs /api/v1/qr until the plan limit -> expects `limit` successes then 403.
3. Verifies the 403 message names the SoT limit, then cleans up all test data.
"""
from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import paramiko  # noqa: E402

HOST = "31.97.113.170"
BASE = "https://qrbanner.com"
REPO = Path(__file__).resolve().parent.parent.parent


def free_plan_qr_limit() -> int:
    plans = (REPO / "lib" / "plans.ts").read_text(encoding="utf-8")
    free_block = plans.split("free:", 1)[1].split("pro:", 1)[0]
    return int(re.search(r"maxQrCodes:\s*(\d+)", free_block).group(1))


def ssh_client() -> paramiko.SSHClient:
    pw = os.environ.get("QRBANNER_SSH_PW", "112358Onrks..")
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username="root", password=pw, timeout=20)
    return c


def run_remote_node(c: paramiko.SSHClient, local_script: Path, remote_name: str) -> str:
    sftp = c.open_sftp()
    remote_path = f"/var/www/qrbanner/{remote_name}"
    sftp.put(str(local_script), remote_path)
    sftp.close()
    cmd = f"cd /var/www/qrbanner && set -a && . ./.env 2>/dev/null; set +a; node {remote_name}; rm -f {remote_name}"
    _, stdout, stderr = c.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if err:
        print("  remote stderr:", err[:400])
    return out


def api_post_qr(key: str, name: str) -> tuple[int, str]:
    body = json.dumps(
        {"name": name, "category": "url", "url": "https://qrbanner.com/?e2e=limit-test"}
    ).encode()
    req = urllib.request.Request(
        BASE + "/api/v1/qr",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            return res.status, res.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")


def main() -> int:
    limit = free_plan_qr_limit()
    print(f"=== E2E free plan limit test (SoT limit = {limit}) ===\n")

    c = ssh_client()
    failed = 0
    try:
        out = run_remote_node(c, REPO / "scripts" / "qa" / "e2e-free-limit-user.cjs", "e2e-tmp-user.cjs")
        info = json.loads(out.splitlines()[-1])
        key = info["key"]
        print(f"[1] test user created ({info['userId'][:10]}...), key {key[:16]}...")

        created = 0
        for i in range(1, limit + 2):
            status, body = api_post_qr(key, f"E2E limit test {i}")
            if i <= limit:
                if status == 201:
                    created += 1
                    print(f"[2] create #{i}: 201 OK")
                else:
                    print(f"[2] create #{i}: FAIL expected 201, got {status}: {body[:160]}")
                    failed += 1
            else:
                expect = f"QR limit reached ({limit}"
                if status == 403 and expect in body:
                    print(f"[3] create #{i}: 403 with SoT message OK -> {body[:120]}")
                else:
                    print(f"[3] create #{i}: FAIL expected 403 '{expect}', got {status}: {body[:200]}")
                    failed += 1
            time.sleep(0.4)

        if created != limit:
            print(f"FAIL: created {created}, expected {limit}")
            failed += 1
    finally:
        out = run_remote_node(
            c, REPO / "scripts" / "qa" / "e2e-free-limit-cleanup.cjs", "e2e-tmp-cleanup.cjs"
        )
        print(f"[4] cleanup: {out.splitlines()[-1] if out else '?'}")
        c.close()

    print(f"\n=== Result: {'FAIL (' + str(failed) + ')' if failed else 'PASS'} ===")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
