#!/usr/bin/env python3
"""Upload changed files and run production build on VPS."""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from deploy_lib import DeployConfig, DeployPlan, execute_plan, dedupe_files

FILES = [
    "lib/industry-templates.ts",
    "lib/qr-utils.ts",
    "lib/analytics-utils.ts",
    "lib/auth-options.ts",
    "lib/qr-style.ts",
    "lib/scannability.ts",
    "lib/qr-ai.ts",
    "lib/optimization-insights.ts",
    "lib/rate-limit.ts",
    "lib/site-content.ts",
    "prisma/schema.prisma",
    "next.config.js",
]

plan = DeployPlan(
    upload=dedupe_files(FILES),
    prisma_generate=True,
    prisma_migrate=True,
    build=True,
    restart=True,
)

raise SystemExit(execute_plan(DeployConfig(), plan))
