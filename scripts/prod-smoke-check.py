#!/usr/bin/env python3
"""Production smoke checks for post-audit verification."""
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
WWW = os.environ.get("WWW_URL", "https://www.qrbanner.com").rstrip("/")


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


NO_REDIRECT_OPENER = urllib.request.build_opener(NoRedirect)


def fetch(url: str, headers: dict | None = None, follow_redirects: bool = True) -> tuple[int, str, dict]:
    req = urllib.request.Request(url, headers=headers or {})
    opener = urllib.request.urlopen if follow_redirects else NO_REDIRECT_OPENER.open
    try:
        with opener(req, timeout=30) as resp:
            hdrs = {k.lower(): v for k, v in resp.headers.items()}
            return resp.status, resp.read().decode("utf-8", errors="replace"), hdrs
    except urllib.error.HTTPError as err:
        hdrs = {k.lower(): v for k, v in err.headers.items()}
        return err.code, err.read().decode("utf-8", errors="replace"), hdrs


def check(name: str, ok: bool, detail: str = "") -> bool:
    mark = "PASS" if ok else "FAIL"
    suffix = f" — {detail}" if detail else ""
    print(f"{mark}: {name}{suffix}")
    return ok


def main() -> int:
    ok = True

    code, _, hdrs = fetch(f"{WWW}/pricing?ref=smoke", follow_redirects=False)
    loc = hdrs.get("location", "")
    ok &= check("www -> apex redirect", code in (301, 302, 307, 308) and loc.startswith("https://qrbanner.com") and ":3000" not in loc, loc)

    code, body, _ = fetch(f"{BASE}/robots.txt")
    ok &= check("robots.txt 200", code == 200)
    ok &= check("robots allows /qr/create", "Allow: /qr/create" in body)

    code, body, _ = fetch(f"{BASE}/qr/create")
    ok &= check("/qr/create 200", code == 200)
    ok &= check("/qr/create not noindex", 'name="robots" content="noindex' not in body.lower())

    code, body, _ = fetch(f"{BASE}/tr/solutions/restaurant-menu")
    ok &= check("/tr/solutions/* 200", code == 200)
    ok &= check("TR solutions localized", "restoran" in body.lower() or "menü" in body.lower() or "çözüm" in body.lower())

    code, body, _ = fetch(f"{BASE}/")
    ok &= check("Consent Mode bootstrap", "consent" in body.lower() and ("gtag" in body.lower() or "googletagmanager" in body.lower() or "dataLayer" in body))

    code, body, _ = fetch(f"{BASE}/vs/uniqode")
    ok &= check("/vs/* competitor page 200", code == 200)
    ok &= check("JSON-LD on vs page", "application/ld+json" in body)

    code, body, _ = fetch(f"{BASE}/api/health")
    ok &= check("health public", '"ok":true' in body.replace(" ", "") or '"ok": true' in body)

    print("\nRESULT:", "PASS" if ok else "FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
