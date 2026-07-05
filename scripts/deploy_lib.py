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
    host: str = os.environ.get("DEPLOY_HOST", "31.97.113.170")
    user: str = os.environ.get("DEPLOY_USER", "root")
    password: str | None = os.environ.get("DEPLOY_PASSWORD")
    local: str = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
    remote: str = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")
    timeout: int = 30

    def require_password(self) -> str:
        if not self.password:
            print("ERROR: Set DEPLOY_PASSWORD environment variable.", file=sys.stderr)
            raise SystemExit(1)
        return self.password


@dataclass
class DeployPlan:
    upload: list[str] = field(default_factory=list)
    remove: list[str] = field(default_factory=list)
    yarn_install: bool = False
    prisma_generate: bool = False
    prisma_push: bool = False
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


def connect(cfg: DeployConfig) -> tuple[paramiko.SSHClient, paramiko.SFTPClient]:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(cfg.host, username=cfg.user, password=cfg.require_password(), timeout=cfg.timeout)
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


def run_ssh(client: paramiko.SSHClient, command: str, timeout: int = 900) -> str:
    print("\n>>>", command)
    _, stdout, stderr = client.exec_command(command, timeout=timeout)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    combined = out + err
    if combined.strip():
        print(combined.rstrip())
    return combined


def build_post_commands(plan: DeployPlan, cfg: DeployConfig) -> list[str]:
    cmds: list[str] = []
    base = f"cd {cfg.remote}"
    if plan.yarn_install:
        cmds.append(f"{base} && yarn install --frozen-lockfile 2>&1 | tail -12")
    if plan.prisma_generate:
        cmds.append(f"{base} && yarn prisma generate 2>&1 | tail -8")
    if plan.prisma_push:
        cmds.append(f"{base} && yarn prisma db push --accept-data-loss 2>&1 | tail -20")
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
    for cmd in build_post_commands(plan, cfg):
        output += run_ssh(client, cmd)

    client.close()
    if plan.build and "Failed to compile" in output:
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
