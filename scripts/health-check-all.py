#!/usr/bin/env python3
"""Run all production health checks in one shot."""
import os
import subprocess
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://qrbanner.com"

PAGES = [
    "/",
    "/login",
    "/forgot-password",
    "/reset-password",
    "/pricing",
    "/features",
    "/status",
    "/sitemap.xml",
    "/robots.txt",
    "/api/health",
    "/api/billing/status",
]

print("=== HTTP health ===")
for path in PAGES:
    url = BASE + path
    r = subprocess.run(
        ["curl.exe", "-s", "-o", "NUL", "-w", "%{http_code}", url],
        capture_output=True,
        text=True,
    )
    code = (r.stdout or r.stderr or "?").strip()
    ok = "OK" if code == "200" else "FAIL"
    print(f"  [{ok}] {code} {path}")

print("\n=== SEO / marketing regression (P4-26 / P4-27) ===")
for name in ["verify-sitemap-health.py", "verify-marketing-claims.py"]:
    print(f"\n--- {name} ---")
    p = subprocess.run(
        [sys.executable, os.path.join(ROOT, "scripts", name)],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    out = (p.stdout or p.stderr or "").strip()
    print(out)
    if p.returncode != 0:
        print(f"(exit {p.returncode})")

print("\n=== VPS / SMTP / reset-code (remote) ===")
scripts = [
    "check-vps-status.py",
    "smtp-live-test.py",
    "test-reset-code.py",
]
for name in scripts:
    print(f"\n--- {name} ---")
  # smtp test needs recipient; skip send if no arg
    args = [sys.executable, os.path.join(ROOT, "scripts", name)]
    if name == "smtp-live-test.py":
        args.append("support@qrbanner.com")
    p = subprocess.run(
        args,
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    out = (p.stdout or p.stderr or "").strip()
    print(out[-1200:] if len(out) > 1200 else out)
    if p.returncode != 0:
        print(f"(exit {p.returncode})")

print("\n=== Done ===")
