#!/usr/bin/env python3
"""Scan redirect latency — TTFB and total time for public scan routes."""
import os
import statistics
import subprocess
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")
SAMPLES = int(os.environ.get("SCAN_LATENCY_SAMPLES", "5"))
MAX_TTFB_MS = float(os.environ.get("SCAN_MAX_TTFB_MS", "800"))
MAX_TOTAL_MS = float(os.environ.get("SCAN_MAX_TOTAL_MS", "1500"))

# draft-preview: editor placeholder (200 HTML). Use a stable public path.
TARGETS = [
    ("/s/draft-preview", "draft-preview (200 HTML)"),
    ("/api/health", "health baseline"),
]

FAILURES: list[str] = []


def fail(msg: str) -> None:
    FAILURES.append(msg)
    print(f"  [FAIL] {msg}")


def ok(msg: str) -> None:
    print(f"  [OK] {msg}")


def curl_timing(url: str) -> tuple[int, float, float]:
    """Returns (http_code, ttfb_ms, total_ms)."""
    fmt = "%{http_code} %{time_starttransfer} %{time_total}"
    r = subprocess.run(
        ["curl.exe", "-sL", "-o", "NUL", "-w", fmt, url],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    parts = (r.stdout or "").strip().split()
    if len(parts) < 3:
        return 0, 0.0, 0.0
    code = int(parts[0])
    ttfb = float(parts[1]) * 1000
    total = float(parts[2]) * 1000
    return code, ttfb, total


def main() -> int:
    print(f"=== Scan latency ({BASE}, {SAMPLES} samples) ===\n")

    for path, label in TARGETS:
        url = f"{BASE}{path}"
        ttfbs: list[float] = []
        totals: list[float] = []
        code = 0
        for _ in range(SAMPLES):
            code, ttfb, total = curl_timing(url)
            if code:
                ttfbs.append(ttfb)
                totals.append(total)

        if not ttfbs:
            fail(f"{label}: no successful samples")
            continue

        med_ttfb = statistics.median(ttfbs)
        med_total = statistics.median(totals)
        p95_ttfb = sorted(ttfbs)[min(len(ttfbs) - 1, int(len(ttfbs) * 0.95))]
        print(
            f"  {label}: HTTP {code} | "
            f"TTFB median={med_ttfb:.0f}ms p95={p95_ttfb:.0f}ms | "
            f"total median={med_total:.0f}ms"
        )

        if path.startswith("/s/"):
            if med_ttfb > MAX_TTFB_MS:
                fail(f"{label} TTFB median {med_ttfb:.0f}ms > {MAX_TTFB_MS:.0f}ms")
            else:
                ok(f"{label} TTFB within {MAX_TTFB_MS:.0f}ms")
            if med_total > MAX_TOTAL_MS:
                fail(f"{label} total median {med_total:.0f}ms > {MAX_TOTAL_MS:.0f}ms")
            else:
                ok(f"{label} total within {MAX_TOTAL_MS:.0f}ms")

    print()
    if FAILURES:
        print(f"=== Result: FAIL ({len(FAILURES)} issue(s)) ===")
        return 1
    print("=== Result: PASS ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
