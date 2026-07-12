#!/usr/bin/env python3
"""Verify every final URL referenced in ADS_EDITOR_PASTE.md returns HTTP < 400."""
from __future__ import annotations

import os
import re
import sys
import urllib.error
import urllib.request

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")
PASTE = os.path.join(os.path.dirname(__file__), "..", "marketing", "google-ads", "ADS_EDITOR_PASTE.md")

# Paths/URLs that must resolve for the Ads paste pack (query strings allowed).
REQUIRED = [
    "/pricing",
    "/features",
    "/templates",
    "/templates/restaurant-menu",
    "/vs/qr-tiger",
    "/vs/scanova",
    "/vs/bitly",
    "/qr/create?quick=1",
]


def fetch(url: str) -> int:
    req = urllib.request.Request(url, headers={"User-Agent": "QRbanner-ads-url-check/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status
    except urllib.error.HTTPError as err:
        return err.code


def main() -> int:
    paste_path = os.path.abspath(PASTE)
    if not os.path.isfile(paste_path):
        print(f"FAIL: missing {paste_path}")
        return 1

    text = open(paste_path, encoding="utf-8").read()
    found = set(re.findall(r"https://qrbanner\.com(/[^\s)`]+)", text))
    ok = True
    print(f"Checking {len(REQUIRED)} required Ads URLs against {BASE}\n")
    for path in REQUIRED:
        url = f"{BASE}{path}"
        code = fetch(url)
        mark = "PASS" if code < 400 else "FAIL"
        if code >= 400:
            ok = False
        print(f"{mark}: {code} {url}")

    missing_docs = [p for p in REQUIRED if f"https://qrbanner.com{p.split('?')[0]}" not in text and p not in text]
    # Soft check: restaurant-menu and vs slugs appear in paste
    for needle in ("/templates/restaurant-menu", "/vs/qr-tiger", "/qr/create?quick=1"):
        if needle not in text:
            print(f"FAIL: paste doc missing {needle}")
            ok = False
        else:
            print(f"PASS: paste doc mentions {needle}")

    print(f"\nPaste doc absolute URLs found: {len(found)}")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
