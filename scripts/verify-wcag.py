#!/usr/bin/env python3
"""WCAG smoke via pa11y (WCAG2AA) on key public pages."""
import os
import subprocess
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")
PAGES = [
    "/",
    "/pricing",
    "/login",
    "/case-studies",
]

FAILURES: list[str] = []


def main() -> int:
    print(f"=== WCAG pa11y smoke ({BASE}) ===\n")

    for path in PAGES:
        url = f"{BASE}{path}"
        print(f"--- {path or '/'} ---")
        r = subprocess.run(
            [
                "npx",
                "--yes",
                "pa11y",
                url,
                "--standard",
                "WCAG2AA",
                "--reporter",
                "cli",
                "--timeout",
                "120000",
            ],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            shell=True,
        )
        out = (r.stdout or "") + (r.stderr or "")
        # pa11y exits 2 on issues, 0 on pass
        issue_lines = [ln for ln in out.splitlines() if ln.strip().startswith("•") or "Error:" in ln]
        if r.returncode == 0:
            print(f"  [OK] no WCAG2AA errors")
        elif r.returncode == 2:
            count = len(issue_lines) or out.count("Error:")
            print(f"  [WARN] {count} issue(s) reported")
            for ln in issue_lines[:8]:
                print(f"    {ln.strip()}")
            if count > 10:
                FAILURES.append(f"{path}: {count}+ WCAG issues")
            else:
                print(f"  [OK] under threshold (<=10) — review warnings above")
        else:
            print(out[-1500:])
            FAILURES.append(f"{path}: pa11y failed (exit {r.returncode})")
        print()

    if FAILURES:
        print(f"=== Result: FAIL ({len(FAILURES)} page(s)) ===")
        return 1
    print("=== Result: PASS ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
