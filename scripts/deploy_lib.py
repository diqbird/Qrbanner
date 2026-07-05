#!/usr/bin/env python3
"""Shared VPS deploy helpers for Qrbanner."""
from __future__ import annotations

import os
import sys
from dataclasses import dataclass, field
from typing import Iterable, Sequence

try:
    import paramiko
except ImportError as exc:  # pragma: no cover
    raise SystemExit("paramiko required: pip install paramiko") from exc

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass


@dataclass
class DeployConfig:
    host: str = os.environ.get("DEPLOY_HOST", "")
    user: str = os.environ.get("DEPLOY_USER", "root")
    password: str | None = os.environ.get("DEPLOY_PASSWORD")
    key_path: str | None = os.environ.get("DEPLOY_SSH_KEY_PATH")
    key_passphrase: str | None = os.environ.get("DEPLOY_SSH_KEY_PASSPHRASE")
    known_hosts: str | None = os.environ.get("DEPLOY_KNOWN_HOSTS")
    local: str = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
    remote: str = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")
    timeout: int = int(os.environ.get("DEPLOY_TIMEOUT", "30"))

    def require_host(self) -> str:
        if not self.host.strip():
            print("ERROR: Set DEPLOY_HOST environment variable.", file=sys.stderr)
            raise SystemExit(1)
        return self.host.strip()


@dataclass
class DeployPlan:
    upload: list[str] = field(default_factory=list)
    remove: list[str] = field(default_factory=list)
    yarn_install: bool = False
    prisma_generate: bool = False
    prisma_migrate: bool = False
    prisma_baseline: str | None = None
    prisma_push: bool = False  # deprecated — maps to prisma_migrate with warning
    build: bool = True
    restart: bool = True
    extra_commands: list[str] = field(default_factory=list)


def ensure_remote_dir(sftp: paramiko.SFTPClient, remote_dir: str) -> None:
    parts = remote_dir.replace("\\", "/").strip("/").split("/")
    path = ""
    for part in parts:
        path += "/" + part
        try:
            sftp.stat(path)
        except OSError:
            sftp.mkdir(path)


def _load_host_key_policy(cfg: DeployConfig) -> paramiko.MissingHostKeyPolicy:
    if cfg.known_hosts and os.path.isfile(os.path.expanduser(cfg.known_hosts)):
        return paramiko.RejectPolicy()
    if os.environ.get("DEPLOY_STRICT_HOST_KEY") == "1":
        print("ERROR: DEPLOY_STRICT_HOST_KEY=1 but DEPLOY_KNOWN_HOSTS file missing.", file=sys.stderr)
        raise SystemExit(1)
    print("WARN: DEPLOY_KNOWN_HOSTS not set — using AutoAddPolicy (insecure).", file=sys.stderr)
    return paramiko.AutoAddPolicy()


def connect(cfg: DeployConfig) -> tuple[paramiko.SSHClient, paramiko.SFTPClient]:
    host = cfg.require_host()
    client = paramiko.SSHClient()
    policy = _load_host_key_policy(cfg)
    client.set_missing_host_key_policy(policy)
    if cfg.known_hosts and os.path.isfile(os.path.expanduser(cfg.known_hosts)):
        client.load_host_keys(os.path.expanduser(cfg.known_hosts))

    connect_kwargs: dict = {
        "hostname": host,
        "username": cfg.user,
        "timeout": cfg.timeout,
        "allow_agent": True,
        "look_for_keys": not bool(cfg.key_path),
    }

    if cfg.key_path:
        key_file = os.path.expanduser(cfg.key_path)
        if not os.path.isfile(key_file):
            print(f"ERROR: SSH key not found: {key_file}", file=sys.stderr)
            raise SystemExit(1)
        connect_kwargs["key_filename"] = key_file
        if cfg.key_passphrase:
            connect_kwargs["passphrase"] = cfg.key_passphrase
    elif cfg.password:
        print("WARN: Using DEPLOY_PASSWORD — prefer DEPLOY_SSH_KEY_PATH.", file=sys.stderr)
        connect_kwargs["password"] = cfg.password
    else:
        print("ERROR: Set DEPLOY_SSH_KEY_PATH or DEPLOY_PASSWORD.", file=sys.stderr)
        raise SystemExit(1)

    client.connect(**connect_kwargs)
    return client, client.open_sftp()


def upload_files(
    sftp: paramiko.SFTPClient,
    cfg: DeployConfig,
    files: Sequence[str],
) -> list[str]:
    uploaded: list[str] = []
    for rel in files:
        rel_norm = rel.replace("\\", "/")
        local_path = os.path.join(cfg.local, rel_norm.replace("/", os.sep))
        if not os.path.isfile(local_path):
            print("SKIP missing:", rel_norm)
            continue
        remote_path = f"{cfg.remote}/{rel_norm}"
        ensure_remote_dir(sftp, os.path.dirname(remote_path))
        sftp.put(local_path, remote_path)
        uploaded.append(rel_norm)
        print("ok upload", rel_norm)
    return uploaded


def remove_files(
    sftp: paramiko.SFTPClient,
    cfg: DeployConfig,
    files: Sequence[str],
) -> None:
    for rel in files:
        rel_norm = rel.replace("\\", "/")
        remote_path = f"{cfg.remote}/{rel_norm}"
        try:
            sftp.remove(remote_path)
            print("ok remove", rel_norm)
        except FileNotFoundError:
            print("skip remove (missing)", rel_norm)
        except OSError as exc:
            print("warn remove", rel_norm, exc)


def run_ssh(client: paramiko.SSHClient, command: str, timeout: int = 900) -> tuple[str, int]:
    print("\n>>>", command)
    _, stdout, stderr = client.exec_command(command, timeout=timeout)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    combined = out + err
    if combined.strip():
        print(combined.rstrip())
    return combined, exit_code


def build_post_commands(plan: DeployPlan, cfg: DeployConfig) -> list[str]:
    cmds: list[str] = []
    base = f"cd {cfg.remote}"
    if plan.yarn_install:
        cmds.append(f"{base} && yarn install --frozen-lockfile 2>&1 | tail -12")
    if plan.prisma_generate:
        cmds.append(f"{base} && yarn prisma generate 2>&1 | tail -8")
    if plan.prisma_migrate or plan.prisma_push:
        if plan.prisma_push:
            print("WARN: prisma_push is deprecated — using prisma migrate deploy instead", file=sys.stderr)
        if plan.prisma_baseline:
            cmds.append(
                f"{base} && (yarn prisma migrate resolve --applied {plan.prisma_baseline} "
                f"2>&1 || true) | tail -8"
            )
        cmds.append(f"{base} && yarn prisma migrate deploy 2>&1 | tail -20")
    if plan.build:
        cmds.append(f"{base} && yarn build 2>&1 | tail -20")
    if plan.restart:
        cmds.append("pm2 restart qrbanner 2>&1 | tail -3")
    cmds.extend(plan.extra_commands)
    return cmds


def execute_plan(cfg: DeployConfig, plan: DeployPlan) -> int:
    client, sftp = connect(cfg)
    try:
        if plan.upload:
            upload_files(sftp, cfg, plan.upload)
        if plan.remove:
            remove_files(sftp, cfg, plan.remove)
    finally:
        sftp.close()

    output = ""
    failed = False
    for cmd in build_post_commands(plan, cfg):
        combined, exit_code = run_ssh(client, cmd)
        output += combined
        if exit_code != 0 and "yarn build" in cmd:
            failed = True

    client.close()
    if plan.build and ("Failed to compile" in output or failed):
        print("BUILD FAILED", file=sys.stderr)
        return 1
    print("Deploy complete.")
    return 0


def dedupe_files(files: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for rel in files:
        norm = rel.replace("\\", "/")
        if norm not in seen:
            seen.add(norm)
            out.append(norm)
    return out
