#!/usr/bin/env python3
"""Unified VPS deploy CLI.

Examples:
  python scripts/deploy.py --manifest scripts/manifests/faz1-refactor.json
  python scripts/deploy.py --file lib/session-auth.ts --file app/api/leads/route.ts --build --restart
  python scripts/deploy.py --glob "app/api/**/route.ts" --build
"""
from __future__ import annotations

import argparse
import json
import sys
from glob import glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from deploy_lib import DeployConfig, DeployPlan, dedupe_files, execute_plan


def expand_globs(patterns: list[str], base: Path) -> list[str]:
    files: list[str] = []
    for pattern in patterns:
        for path in glob(str(base / pattern), recursive=True):
            p = Path(path)
            if p.is_file():
                files.append(p.relative_to(base).as_posix())
    return files


def load_manifest(path: Path) -> DeployPlan:
    data = json.loads(path.read_text(encoding="utf-8"))
    return DeployPlan(
        upload=dedupe_files(data.get("upload", [])),
        remove=dedupe_files(data.get("remove", [])),
        yarn_install=bool(data.get("yarn_install", False)),
        prisma_generate=bool(data.get("prisma_generate", False)),
        prisma_push=bool(data.get("prisma_push", False)),
        build=bool(data.get("build", True)),
        restart=bool(data.get("restart", True)),
        extra_commands=list(data.get("extra_commands", [])),
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Deploy files to Qrbanner VPS")
    parser.add_argument("--manifest", type=Path, help="JSON manifest with upload/remove/post flags")
    parser.add_argument("--file", action="append", default=[], dest="files", help="File to upload (repeatable)")
    parser.add_argument("--remove", action="append", default=[], help="Remote file to delete (repeatable)")
    parser.add_argument("--glob", action="append", default=[], dest="globs", help="Glob under repo root")
    parser.add_argument("--yarn-install", action="store_true")
    parser.add_argument("--prisma-generate", action="store_true")
    parser.add_argument("--prisma-push", action="store_true")
    parser.add_argument("--build", action="store_true", default=False)
    parser.add_argument("--no-build", action="store_true")
    parser.add_argument("--restart", action="store_true", default=False)
    parser.add_argument("--no-restart", action="store_true")
    args = parser.parse_args()

    if args.manifest:
        plan = load_manifest(args.manifest)
    else:
        plan = DeployPlan()

    plan.upload = dedupe_files([*plan.upload, *args.files, *expand_globs(args.globs, ROOT)])
    plan.remove = dedupe_files([*plan.remove, *args.remove])

    if args.yarn_install:
        plan.yarn_install = True
    if args.prisma_generate:
        plan.prisma_generate = True
    if args.prisma_push:
        plan.prisma_push = True
    if args.build:
        plan.build = True
    if args.no_build:
        plan.build = False
    if args.restart:
        plan.restart = True
    if args.no_restart:
        plan.restart = False

    if not plan.upload and not plan.remove and not plan.extra_commands:
        if not (plan.yarn_install or plan.prisma_generate or plan.prisma_push or plan.build or plan.restart):
            parser.error("Nothing to deploy — pass --file, --glob, or --manifest")

    cfg = DeployConfig()
    return execute_plan(cfg, plan)


if __name__ == "__main__":
    raise SystemExit(main())
