#!/usr/bin/env python3
"""Live snippet / meta health for GSC follow-up.

Checks that pricing meta reflects free-plan SoT (lib/plans.ts free.maxQrCodes)
and that stale marketing numbers (25 / 50 free codes) are absent from key URLs.

Run: python scripts/verify-gsc-snippet-health.py
"""
from __future__ import annotations

import re
import sys
import urllib.request
from pathlib import Path

BASE = "https://qrbanner.com"


def free_plan_qr_limit() -> int:
    """Read PLANS.free.maxQrCodes from lib/plans.ts (SoT)."""
    plans = (Path(__file__).resolve().parent.parent / "lib" / "plans.ts").read_text(encoding="utf-8")
    free_block = plans.split("free:", 1)[1].split("pro:", 1)[0]
    m = re.search(r"maxQrCodes:\s*(\d+)", free_block)
    if not m:
        raise RuntimeError("maxQrCodes not found in lib/plans.ts free block")
    return int(m.group(1))


FREE_N = free_plan_qr_limit()
TARGETS = [
    ("/", False),
    ("/pricing", True),
    ("/tr/pricing", True),
    ("/templates", False),
    ("/llms.txt", False),
    ("/reviews", False),
]

STALE = [
    re.compile(r"25\s+(free\s+)?dynamic", re.I),
    re.compile(r"50\s+dynamic\s+QR", re.I),
    re.compile(r"25\s+dinamik", re.I),
    re.compile(r"50\s+dinamik", re.I),
]

NEED_FREE_ONE = [
    re.compile(rf"{FREE_N}\s+dynamic\s+QR", re.I),
    re.compile(rf"{FREE_N}\s+dinamik\s+QR", re.I),
]


def fetch(path: str) -> str:
    req = urllib.request.Request(
        BASE + path,
        headers={"User-Agent": "QRbanner-GSC-Snippet-Health/1.0"},
    )
    with urllib.request.urlopen(req, timeout=30) as res:
        return res.read().decode("utf-8", errors="replace")


def meta_description(html: str) -> str:
    m = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']', html, re.I)
    if m:
        return m.group(1)
    m = re.search(r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']', html, re.I)
    return m.group(1) if m else ""


def _safe(s: str) -> str:
    """ASCII-safe for Windows consoles (cp1254 etc.)."""
    return s.encode("ascii", errors="replace").decode("ascii")


def main() -> int:
    print(f"=== GSC snippet health ({BASE}) ===\n")
    failed = 0
    for path, require_one in TARGETS:
        try:
            body = fetch(path)
        except Exception as e:
            print(f"  [FAIL] {path} fetch: {e}")
            failed += 1
            continue
        desc = meta_description(body) if not path.endswith(".txt") else body[:240]
        stale_hits = [p.pattern for p in STALE if p.search(body) or p.search(desc)]
        if stale_hits:
            print(f"  [FAIL] {path} stale copy matched: {stale_hits}")
            failed += 1
        elif require_one and not any(p.search(desc) or p.search(body) for p in NEED_FREE_ONE):
            print(f"  [FAIL] {path} missing '{FREE_N} dynamic/dinamik QR' in meta/body")
            print(f"         meta: {_safe(desc[:140])}")
            failed += 1
        else:
            print(f"  [OK] {path}")
            if desc:
                print(f"       meta: {_safe(desc[:120])}...")

    print("\n--- Manual GSC clicks (cannot automate) ---")
    print("1. Search Console → property https://qrbanner.com")
    print("2. Sitemaps → confirm/resubmit https://qrbanner.com/sitemap.xml")
    print("3. URL Inspection → Request indexing for /, /pricing, /tr/pricing, /templates, /llms.txt")
    print(f"4. Watch snippet for Free plan = {FREE_N} dynamic QR (not 25/50)")

    print("\n--- G2 / Capterra ---")
    print("QRbanner is not listed on G2/Capterra yet. Claim profile, then set on VPS:")
    print("  NEXT_PUBLIC_G2_REVIEW_URL=https://www.g2.com/products/<slug>/reviews")
    print("  NEXT_PUBLIC_CAPTERRA_REVIEW_URL=https://www.capterra.com/p/<id>/reviews")
    print("Then rebuild. Until set, homepage shows early-adopter reviews strip → /reviews.")

    if failed:
        print(f"\n=== Result: FAIL ({failed}) ===")
        return 1
    print("\n=== Result: PASS ===")
    return 0


if __name__ == "__main__":
    sys.exit(main())
