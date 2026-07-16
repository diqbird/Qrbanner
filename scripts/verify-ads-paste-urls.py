#!/usr/bin/env python3
"""Verify Ads paste-pack final URLs (EN + DE + ES + TR) return HTTP < 400."""
from __future__ import annotations

import os
import sys
import time
import urllib.error
import urllib.request

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")
ADS_DIR = os.path.join(os.path.dirname(__file__), "..", "marketing", "google-ads")

PACKS = {
    "EN": {
        "file": "ADS_EDITOR_PASTE.md",
        "urls": [
            "/pricing",
            "/features",
            "/templates",
            "/templates/restaurant-menu",
            "/vs/qr-tiger",
            "/vs/scanova",
            "/vs/bitly",
            "/qr/create?quick=1",
        ],
        "needles": ("/templates/restaurant-menu", "/vs/qr-tiger", "/qr/create?quick=1"),
    },
    "DE": {
        "file": "ADS_EDITOR_PASTE_DE.md",
        "urls": [
            "/de/qr/create?quick=1",
            "/de/vs/qr-tiger",
            "/de/templates/restaurant-menu",
            "/de/pricing",
            "/de/features",
            "/de/templates",
        ],
        "needles": ("/de/qr/create?quick=1", "/de/vs/qr-tiger", "/de/templates/restaurant-menu"),
    },
    "ES": {
        "file": "ADS_EDITOR_PASTE_ES.md",
        "urls": [
            "/es/qr/create?quick=1",
            "/es/vs/qr-tiger",
            "/es/templates/restaurant-menu",
            "/es/pricing",
            "/es/features",
            "/es/templates",
        ],
        "needles": ("/es/qr/create?quick=1", "/es/vs/qr-tiger", "/es/templates/restaurant-menu"),
    },
    "TR": {
        "file": "ADS_EDITOR_PASTE_TR.md",
        "urls": [
            "/tr/qr/create?quick=1",
            "/tr/vs/qr-tiger",
            "/tr/templates/restaurant-menu",
            "/tr/pricing",
            "/tr/features",
            "/tr/templates",
        ],
        "needles": ("/tr/qr/create?quick=1", "/tr/vs/qr-tiger", "/tr/templates/restaurant-menu"),
    },
}


def fetch(url: str, *, attempts: int = 4) -> int:
    """Return HTTP status; retry transient connection resets / timeouts."""
    last_err: Exception | None = None
    for i in range(attempts):
        req = urllib.request.Request(url, headers={"User-Agent": "QRbanner-ads-url-check/1.0"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.status
        except urllib.error.HTTPError as err:
            return err.code
        except (urllib.error.URLError, TimeoutError, ConnectionResetError, OSError) as err:
            last_err = err
            if i + 1 < attempts:
                time.sleep(1.5 * (i + 1))
                continue
            raise
    raise last_err or RuntimeError(f"fetch failed: {url}")


def check_pack(label: str, cfg: dict) -> bool:
    path = os.path.abspath(os.path.join(ADS_DIR, cfg["file"]))
    ok = True
    print(f"=== {label}: {cfg['file']} ===")
    if not os.path.isfile(path):
        print(f"FAIL: missing {path}")
        return False

    text = open(path, encoding="utf-8").read()
    for rel in cfg["urls"]:
        url = f"{BASE}{rel}"
        code = fetch(url)
        mark = "PASS" if code < 400 else "FAIL"
        if code >= 400:
            ok = False
        print(f"{mark}: {code} {url}")

    for needle in cfg["needles"]:
        if needle not in text:
            print(f"FAIL: paste doc missing {needle}")
            ok = False
        else:
            print(f"PASS: paste doc mentions {needle}")
    print()
    return ok


def main() -> int:
    ok = True
    for label, cfg in PACKS.items():
        ok &= check_pack(label, cfg)
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
