#!/usr/bin/env python3
"""One-time setup: GitHub Actions deploy SSH key + secrets + E2E variable.

Requires: gh CLI logged in, DEPLOY_PASSWORD (or DEPLOY_SSH_KEY_PATH already on VPS).

Usage:
  DEPLOY_PASSWORD=... python scripts/setup-github-deploy-secrets.py
  python scripts/setup-github-deploy-secrets.py --skip-vps   # secrets only (key already on VPS)
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, os.path.dirname(__file__))
from deploy_lib import DeployConfig, connect, run_ssh  # noqa: E402

REPO = os.environ.get("GITHUB_REPOSITORY", "diqbird/Qrbanner")
ENV_NAME = os.environ.get("GITHUB_DEPLOY_ENV", "Production")
KEY_PATH = Path(os.path.expanduser(os.environ.get("DEPLOY_GH_KEY_PATH", "~/.ssh/qrbanner_github_deploy")))


def run(cmd: list[str], *, input_bytes: bytes | None = None) -> None:
    print("+", " ".join(cmd))
    subprocess.run(cmd, input=input_bytes, check=True)


def ensure_key() -> None:
    KEY_PATH.parent.mkdir(parents=True, exist_ok=True)
    if KEY_PATH.exists():
        print(f"SSH key already exists: {KEY_PATH}")
        return
    run(
        [
            "ssh-keygen",
            "-t",
            "ed25519",
            "-f",
            str(KEY_PATH),
            "-N",
            "",
            "-C",
            "github-actions-qrbanner-deploy",
        ]
    )
    print(f"Generated {KEY_PATH}")


def install_pubkey_on_vps(pubkey: str) -> None:
    cfg = DeployConfig()
    client, sftp = connect(cfg)
    auth_path = "/root/.ssh/authorized_keys"
    run_ssh(client, "mkdir -p /root/.ssh && chmod 700 /root/.ssh", timeout=30)
    try:
        with sftp.open(auth_path, "r") as f:
            existing = f.read().decode("utf-8", errors="replace")
    except OSError:
        existing = ""
    if pubkey.split()[1] in existing:
        print("Public key already in VPS authorized_keys.")
    else:
        with sftp.open(auth_path, "a") as f:
            f.write(pubkey + "\n")
        run_ssh(client, f"chmod 600 {auth_path}", timeout=30)
        print("Installed deploy public key on VPS.")
    sftp.close()
    client.close()


def set_github_secrets(host: str, user: str) -> None:
    priv = KEY_PATH.read_text(encoding="utf-8")
    run(["gh", "secret", "set", "DEPLOY_HOST", "--body", host, "--env", ENV_NAME, "-R", REPO])
    run(["gh", "secret", "set", "DEPLOY_USER", "--body", user, "--env", ENV_NAME, "-R", REPO])
    run(
        ["gh", "secret", "set", "DEPLOY_SSH_KEY", "--env", ENV_NAME, "-R", REPO],
        input_bytes=priv.encode("utf-8"),
    )
    print(f"GitHub secrets set on environment '{ENV_NAME}'.")


def set_e2e_variable() -> None:
    base_url = os.environ.get("PLAYWRIGHT_BASE_URL", "https://qrbanner.com")
    run(["gh", "variable", "set", "PLAYWRIGHT_BASE_URL", "--body", base_url, "-R", REPO])
    print(f"Repository variable PLAYWRIGHT_BASE_URL={base_url}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-vps", action="store_true", help="Do not install pubkey on VPS")
    parser.add_argument("--skip-e2e-var", action="store_true", help="Do not set PLAYWRIGHT_BASE_URL")
    args = parser.parse_args()

    cfg = DeployConfig()
    host = (cfg.host or os.environ.get("DEPLOY_HOST", "31.97.113.170")).strip()
    user = cfg.user or "root"

    ensure_key()
    pub_path = Path(f"{KEY_PATH}.pub")
    if not pub_path.is_file():
        print(f"Missing public key: {pub_path}", file=sys.stderr)
        return 1
    pubkey = pub_path.read_text(encoding="utf-8").strip()

    if not args.skip_vps:
        install_pubkey_on_vps(pubkey)

    set_github_secrets(host, user)
    if not args.skip_e2e_var:
        set_e2e_variable()

    print("\nDone. Test with:")
    print(f"  gh workflow run deploy.yml -R {REPO} -f manifest=ops-paddle-only-cleanup.json")
    print(f"  gh workflow run qa.yml -R {REPO}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
