#!/usr/bin/env python3
"""Sample internal-link + placeholder scan for launch readiness.

Crawls key hub pages, extracts internal hrefs, HEAD-checks a sample of them,
and greps page text for placeholder markers (lorem ipsum, TODO, {{, undefined).
"""
from __future__ import annotations

import re
import sys
import urllib.request
from urllib.parse import urljoin, urlparse

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = "https://qrbanner.com"
SEEDS = [
    "/", "/pricing", "/features", "/solutions", "/use-cases", "/qr-types",
    "/templates", "/vs", "/geo", "/blog", "/faq", "/reviews", "/customers",
    "/enterprise", "/integrations", "/developers", "/about", "/contact",
]
PLACEHOLDER = [
    re.compile(r"lorem ipsum", re.I),
    re.compile(r"\bTODO\b"),
    re.compile(r"\{\{\s*\w+\s*\}\}"),
    re.compile(r">undefined<"),
    re.compile(r">null<"),
    re.compile(r"NaN"),
]


def fetch(url: str) -> tuple[int, str]:
    req = urllib.request.Request(url, headers={"User-Agent": "qrb-link-audit"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception:
        return 0, ""


def status_of(url: str) -> int:
    req = urllib.request.Request(url, headers={"User-Agent": "qrb-link-audit"}, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0


def main() -> int:
    found: set[str] = set()
    bad_pages = 0

    print(f"=== Internal link + placeholder scan ({BASE}) ===\n")
    for seed in SEEDS:
        code, html = fetch(BASE + seed)
        if code != 200:
            print(f"  [FAIL] seed {seed} HTTP {code}")
            bad_pages += 1
            continue

        hits = [p.pattern for p in PLACEHOLDER if p.search(html)]
        if hits:
            print(f"  [WARN] {seed} placeholder-ish match: {hits}")

        for m in re.finditer(r'href="(/[^"#?]*)"', html):
            path = m.group(1)
            if path.startswith(("/api/", "/_next", "/s/")):
                continue
            found.add(path.rstrip("/") or "/")
        print(f"  [OK] seed {seed} scanned")

    # Sample: check every unique path (cap at 120 to be polite)
    paths = sorted(found)[:120]
    print(f"\n--- checking {len(paths)} unique internal links ---")
    broken = []
    for p in paths:
        code = status_of(BASE + p)
        if code >= 400 or code == 0:
            broken.append((p, code))
            print(f"  [FAIL] {code} {p}")
    if not broken:
        print("  all sampled links return < 400")

    print(f"\n=== Result: {'FAIL' if broken or bad_pages else 'PASS'} "
          f"({len(broken)} broken / {len(paths)} checked) ===")
    return 1 if broken or bad_pages else 0


if __name__ == "__main__":
    sys.exit(main())
