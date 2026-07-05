#!/usr/bin/env python3
"""Remove all STRIPE_* lines from VPS .env (Paddle-only billing)."""
from __future__ import annotations

import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from deploy_lib import DeployConfig, connect, run_ssh  # noqa: E402

STRIPE_KEY_PATTERN = re.compile(r"^#?\s*STRIPE_", re.IGNORECASE)


def strip_stripe_env_lines(content: str) -> tuple[str, int]:
    kept: list[str] = []
    removed = 0
    for line in content.split("\n"):
        stripped = line.strip()
        if not stripped:
            kept.append(line)
            continue
        key = stripped.lstrip("#").strip().split("=", 1)[0].strip()
        if STRIPE_KEY_PATTERN.match(key):
            removed += 1
            continue
        kept.append(line)
    return "\n".join(kept), removed


def main() -> int:
    cfg = DeployConfig()
    client, sftp = connect(cfg)
    env_path = f"{cfg.remote}/.env"

    with sftp.open(env_path, "r") as f:
        content = f.read().decode("utf-8", errors="replace")

    new_content, removed = strip_stripe_env_lines(content)
    if removed == 0:
        print("No STRIPE_* keys found in VPS .env (already clean).")
    else:
        with sftp.open(env_path, "w") as f:
            f.write(new_content)
        print(f"Removed {removed} STRIPE_* line(s) from VPS .env.")

    sftp.close()
    run_ssh(client, "pm2 restart qrbanner 2>&1 | tail -3")
    client.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
