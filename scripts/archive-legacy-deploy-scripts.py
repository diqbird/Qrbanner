#!/usr/bin/env python3
"""Move legacy deploy-*.py scripts to scripts/archive/deploy/."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
ARCHIVE = SCRIPTS / "archive" / "deploy"
KEEP = {"deploy.py", "deploy_lib.py", "archive-legacy-deploy-scripts.py"}

ARCHIVE.mkdir(parents=True, exist_ok=True)
moved = 0
for path in sorted(SCRIPTS.glob("deploy*.py")):
    if path.name in KEEP:
        continue
    dest = ARCHIVE / path.name
    shutil.move(str(path), str(dest))
    print("archived", path.name)
    moved += 1
print("total archived:", moved)
