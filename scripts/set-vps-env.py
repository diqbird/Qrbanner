#!/usr/bin/env python3
"""Set or update variables in the VPS .env file.

Examples:
  DEPLOY_HOST=... DEPLOY_PASSWORD=... python scripts/set-vps-env.py HEALTH_DETAIL_SECRET=abc123
  DEPLOY_PASSWORD=... python scripts/set-vps-env.py --generate-health-secret
  python scripts/set-vps-env.py --show HEALTH_DETAIL_SECRET
"""
from __future__ import annotations

import argparse
import os
import re
import secrets
import sys

sys.path.insert(0, os.path.dirname(__file__))
from deploy_lib import DeployConfig, connect, run_ssh  # noqa: E402


def set_env_var(content: str, key: str, value: str) -> str:
    line = f'{key}="{value}"'
    pattern = rf"^{re.escape(key)}=.*$"
    if re.search(pattern, content, re.MULTILINE):
        return re.sub(pattern, line, content, flags=re.MULTILINE)
    if content and not content.endswith("\n"):
        content += "\n"
    return content + line + "\n"


def read_env_key(content: str, key: str) -> str:
    m = re.search(rf'^{re.escape(key)}="?([^"\n]+)"?', content, re.MULTILINE)
    return m.group(1).strip() if m else ""


def main() -> int:
    parser = argparse.ArgumentParser(description="Update VPS .env variables")
    parser.add_argument(
        "pairs",
        nargs="*",
        help="KEY=value pairs to set",
    )
    parser.add_argument(
        "--generate-health-secret",
        action="store_true",
        help="Generate and set HEALTH_DETAIL_SECRET if missing",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing values",
    )
    parser.add_argument(
        "--show",
        metavar="KEY",
        help="Print current value from VPS .env (no changes)",
    )
    parser.add_argument("--no-restart", action="store_true", help="Skip pm2 restart")
    args = parser.parse_args()

    cfg = DeployConfig()
    client, sftp = connect(cfg)
    env_path = f"{cfg.remote}/.env"

    with sftp.open(env_path, "r") as f:
        content = f.read().decode("utf-8", errors="replace")

    if args.show:
        val = read_env_key(content, args.show)
        if val:
            print(f"{args.show}={val}")
        else:
            print(f"{args.show} is not set")
        sftp.close()
        client.close()
        return 0

    updates: dict[str, str] = {}
    for pair in args.pairs:
        if "=" not in pair:
            print(f"Invalid pair (expected KEY=value): {pair}", file=sys.stderr)
            return 1
        key, value = pair.split("=", 1)
        updates[key.strip()] = value.strip()

    if args.generate_health_secret:
        updates["HEALTH_DETAIL_SECRET"] = secrets.token_urlsafe(32)

    if not updates:
        parser.print_help()
        return 1

    changed = False
    for key, value in updates.items():
        existing = read_env_key(content, key)
        if existing and not args.force:
            print(f"SKIP {key} already set (use --force to overwrite)")
            continue
        content = set_env_var(content, key, value)
        changed = True
        if key.endswith("SECRET") or key.endswith("PASSWORD") or "KEY" in key:
            print(f"SET {key}=*** ({len(value)} chars)")
        else:
            print(f"SET {key}={value}")

    if not changed:
        sftp.close()
        client.close()
        return 0

    with sftp.open(env_path, "w") as f:
        f.write(content)
    sftp.close()

    if not args.no_restart:
        run_ssh(client, "pm2 restart qrbanner 2>&1 | tail -3")
    client.close()
    print("VPS .env updated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
