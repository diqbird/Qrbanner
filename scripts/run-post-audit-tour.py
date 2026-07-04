#!/usr/bin/env python3
"""
Post-OMEGA audit tour — runs every verification step in order (nothing skipped).
Set DEPLOY_PASSWORD for VPS steps.
"""
import os
import subprocess
import sys
import time

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTS = os.path.join(ROOT, "scripts")
RESULTS: list[tuple[str, str, int]] = []


def run_step(num: int, total: int, name: str, script: str, *, optional: bool = False) -> int:
    print(f"\n{'='*60}")
    print(f"STEP {num}/{total}: {name}")
    print(f"{'='*60}\n", flush=True)
    path = os.path.join(SCRIPTS, script)
    t0 = time.time()
    p = subprocess.run([sys.executable, path], cwd=ROOT)
    elapsed = time.time() - t0
    status = "PASS" if p.returncode == 0 else ("SKIP" if optional and p.returncode != 0 else "FAIL")
    RESULTS.append((name, status, int(elapsed)))
    print(f"\n>>> {name}: {status} ({elapsed:.0f}s)\n", flush=True)
    return p.returncode


def run_npm_step(num: int, total: int, name: str, npm_script: str, *, optional: bool = False) -> int:
    print(f"\n{'='*60}")
    print(f"STEP {num}/{total}: {name}")
    print(f"{'='*60}\n", flush=True)
    t0 = time.time()
    p = subprocess.run(["npm", "run", npm_script], cwd=ROOT, shell=True)
    elapsed = time.time() - t0
    status = "PASS" if p.returncode == 0 else ("SKIP" if optional else "FAIL")
    if optional and p.returncode != 0:
        status = "SKIP (local env)"
    RESULTS.append((name, status, int(elapsed)))
    print(f"\n>>> {name}: {status} ({elapsed:.0f}s)\n", flush=True)
    return p.returncode


def main() -> int:
    if not os.environ.get("DEPLOY_PASSWORD"):
        print("Note: DEPLOY_PASSWORD not set — VPS steps will fail. Export it first.\n")

    steps = [
        (1, "Lighthouse local (desktop)", "test:lighthouse", "npm", True),
        (2, "PageSpeed Insights (mobile+desktop)", "pagespeed-audit.py", "py", True),
        (3, "Lighthouse VPS (Playwright Chrome)", "run-lighthouse-remote.py", "py", False),
        (4, "Billing smoke (public endpoints)", "verify-billing-smoke.py", "py", False),
        (5, "Paddle webhook signature (VPS)", "verify-webhook-vps.py", "py", False),
        (6, "Stripe checkout smoke (VPS, skip if Paddle-only)", "smoke-billing-vps.py", "py", True),
        (7, "Email DNS SPF/DKIM/DMARC", "verify-email-dns.py", "py", False),
        (8, "Scan redirect latency", "verify-scan-latency.py", "py", False),
        (9, "WCAG pa11y smoke", "verify-wcag.py", "py", False),
        (10, "Security headers smoke", "security-smoke.py", "py", False),
        (11, "Webhook log analysis (VPS)", "analyze-webhook-logs.py", "py", False),
        (12, "Playwright e2e (local)", "test:e2e", "npm", False),
        (13, "SMTP verify (VPS)", "run-smtp-test.py", "py", False),
    ]
    total = len(steps)
    failures = 0

    for num, name, target, kind, optional in steps:
        if kind == "npm":
            rc = run_npm_step(num, total, name, target, optional=optional)
        else:
            rc = run_step(num, total, name, target, optional=optional)
        if rc != 0 and not optional:
            failures += 1

    print(f"\n{'='*60}")
    print("POST-AUDIT TOUR SUMMARY")
    print(f"{'='*60}")
    for name, status, elapsed in RESULTS:
        print(f"  [{status:16}] {elapsed:4}s  {name}")
    print()
    if failures:
        print(f"=== TOUR COMPLETE with {failures} failure(s) ===")
        return 1
    print("=== TOUR COMPLETE — all required steps PASS ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
