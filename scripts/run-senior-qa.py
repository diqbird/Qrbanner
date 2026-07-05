#!/usr/bin/env python3
"""Orchestrate Senior QA — sequential steps, markdown output."""
import os
import subprocess
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QA = os.path.join(ROOT, "scripts", "qa")


def step(name: str, cmd: list[str], *, cwd=ROOT, shell=False) -> int:
    print(f"\n{'='*60}\nSTEP: {name}\n{'='*60}\n", flush=True)
    p = subprocess.run(cmd, cwd=cwd, shell=shell)
    print(f"\n>>> {name}: exit {p.returncode}\n", flush=True)
    return p.returncode


def main() -> int:
    os.makedirs(os.path.join(ROOT, "qa-reports"), exist_ok=True)
    failures = 0

    rc = step("Discover API inventory", [sys.executable, os.path.join(QA, "discover-apis.py")])
    if rc: failures += 1

    rc = step("Page audit (Playwright, sequential)", ["node", os.path.join(QA, "senior-qa-pages.mjs")])
    if rc: failures += 1

    rc = step("User flows (Playwright, sequential)", ["node", os.path.join(QA, "senior-qa-flows.mjs")])
    if rc: failures += 1

    rc = step("API probes (sequential)", [sys.executable, os.path.join(QA, "senior-qa-apis.py")])
    if rc: failures += 1

    rc = step("Generate markdown reports", [sys.executable, os.path.join(QA, "generate-reports.py")])
    if rc: failures += 1

    print(f"\nSenior QA complete. Reports in qa-reports/ (failures={failures})")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
