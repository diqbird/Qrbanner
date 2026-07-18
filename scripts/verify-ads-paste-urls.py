#!/usr/bin/env python3
"""Verify Ads paste-pack final URLs + plan SoT (EN + DE + ES + TR).

SoT (lib/plans.ts): Free = 5 dynamic QRs · Pro = $9.99/mo.
Fails on stale free counts (25/50) or Scanova/Bitly RSA still saying QR TIGER.
"""
from __future__ import annotations

import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")
ADS_DIR = Path(__file__).resolve().parent.parent / "marketing" / "google-ads"


def free_plan_qr_limit() -> int:
    """Read PLANS.free.maxQrCodes from lib/plans.ts (SoT)."""
    plans = (Path(__file__).resolve().parent.parent / "lib" / "plans.ts").read_text(encoding="utf-8")
    free_block = plans.split("free:", 1)[1].split("pro:", 1)[0]
    m = re.search(r"maxQrCodes:\s*(\d+)", free_block)
    if not m:
        raise RuntimeError("maxQrCodes not found in lib/plans.ts free block")
    return int(m.group(1))


FREE_N = free_plan_qr_limit()

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
        "needles": (
            "/templates/restaurant-menu",
            "/vs/qr-tiger",
            "/vs/scanova",
            "/vs/bitly",
            "/qr/create?quick=1",
            f"{FREE_N} Free Dynamic QR",
            "$9.99",
        ),
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

_WRONG_COUNTS = [n for n in (1, 2, 3, 10, 25, 50) if n != FREE_N]
STALE_CLAIM = [
    re.compile(r"\b25\s+(free\s+)?dynamic", re.I),
    re.compile(r"\b50\s+dynamic\s+QR", re.I),
    re.compile(r"\bunlimited\s+free\s+QR\b", re.I),
    re.compile(rf"\b({'|'.join(map(str, _WRONG_COUNTS))})\s+Free\s+Dynamic\s+QR", re.I),
]


def fetch(url: str, *, attempts: int = 4) -> int:
    last_err: Exception | None = None
    for i in range(attempts):
        req = urllib.request.Request(url, headers={"User-Agent": "QRbanner-ads-url-check/1.1"})
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


def _safe(s: str) -> str:
    return s.encode("ascii", errors="replace").decode("ascii")


def check_pack(label: str, cfg: dict) -> bool:
    path = ADS_DIR / cfg["file"]
    ok = True
    print(f"=== {label}: {cfg['file']} ===")
    if not path.is_file():
        print(f"FAIL: missing {path}")
        return False

    text = path.read_text(encoding="utf-8")
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

    for pat in STALE_CLAIM:
        # Allow instructional "Do not claim unlimited free QR"
        for m in pat.finditer(text):
            start = max(0, m.start() - 40)
            window = text[start : m.end() + 40].lower()
            if "do not" in window or "never promise" in window or "sot:" in window:
                continue
            print(f"FAIL: stale claim matched {_safe(pat.pattern)} near: {_safe(text[m.start() : m.end() + 20])}")
            ok = False
            break
    print()
    return ok


def check_en_rsa_csv() -> bool:
    path = ADS_DIR / "editor-csv" / "04-rsa.csv"
    print(f"=== SoT: {path.relative_to(ADS_DIR)} ===")
    if not path.is_file():
        print("FAIL: missing EN RSA CSV")
        return False
    text = path.read_text(encoding="utf-8")
    ok = True
    headline = f"{FREE_N} Free Dynamic QR Code{'' if FREE_N == 1 else 's'}"
    if headline not in text:
        print(f"FAIL: missing headline '{headline}'")
        ok = False
    else:
        print(f"PASS: {headline} present")
    if "$9.99" not in text:
        print("FAIL: missing Pro price $9.99")
        ok = False
    else:
        print("PASS: $9.99 present")
    # Scanova/Bitly rows must not advertise QR TIGER
    for line in text.splitlines():
        low = line.lower()
        if ("scanova" in low or ",bitly," in low or "bitly qr" in low) and "qr tiger" in low:
            print(f"FAIL: competitor RSA still mentions QR TIGER: {_safe(line[:120])}")
            ok = False
    if "https://qrbanner.com/vs/bitly" not in text:
        print("FAIL: missing Bitly final URL in RSA CSV")
        ok = False
    else:
        print("PASS: Bitly final URL present")
    if "https://qrbanner.com/vs/scanova" not in text:
        print("FAIL: missing Scanova final URL in RSA CSV")
        ok = False
    else:
        print("PASS: Scanova final URL present")
    print()
    return ok


def main() -> int:
    ok = True
    for label, cfg in PACKS.items():
        ok &= check_pack(label, cfg)
    ok &= check_en_rsa_csv()
    print("=== Result: PASS ===" if ok else "=== Result: FAIL ===")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
