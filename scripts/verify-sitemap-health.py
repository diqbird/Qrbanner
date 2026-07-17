#!/usr/bin/env python3
"""P4-26: Sitemap health regression — live XML + static source consistency."""
import os
import re
import subprocess
import sys
import xml.etree.ElementTree as ET

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

BASE = os.environ.get("SITE_URL", "https://qrbanner.com").rstrip("/")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAILURES: list[str] = []


def fail(msg: str) -> None:
    FAILURES.append(msg)
    print(f"  [FAIL] {msg}")


def ok(msg: str) -> None:
    print(f"  [OK] {msg}")


def curl(url: str) -> tuple[int, str]:
    r = subprocess.run(
        ["curl.exe", "-sL", "-w", "\n%{http_code}", url],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    body = r.stdout or r.stderr or ""
    if "\n" in body:
        *lines, code = body.rsplit("\n", 1)
        return int(code.strip() or "0"), "\n".join(lines)
    return 0, body


def count_case_studies() -> int:
    path = os.path.join(ROOT, "lib", "case-studies.ts")
    text = open(path, encoding="utf-8").read()
    return len(re.findall(r"slug:\s*'([^']+)'", text))


def main() -> int:
    print(f"=== Sitemap health ({BASE}) ===\n")

    code, xml = curl(f"{BASE}/sitemap.xml")
    if code != 200:
        fail(f"sitemap.xml HTTP {code}")
        print("\n=== Result: FAIL ===")
        return 1

    ok(f"sitemap.xml HTTP 200 ({len(xml):,} bytes)")

    try:
        root = ET.fromstring(xml)
    except ET.ParseError as e:
        fail(f"sitemap XML parse error: {e}")
        print("\n=== Result: FAIL ===")
        return 1

    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = [el.text.strip() for el in root.findall(".//sm:loc", ns) if el.text]
    if not locs:
        locs = [el.text.strip() for el in root.iter() if el.tag.endswith("loc") and el.text]

    if len(locs) < 80:
        fail(f"too few URLs in sitemap ({len(locs)} < 80)")
    else:
        ok(f"{len(locs)} URLs in sitemap")

    required = [
        f"{BASE}",
        f"{BASE}/pricing",
        f"{BASE}/case-studies",
        f"{BASE}/features",
        f"{BASE}/solutions",
    ]
    normalized = {loc.rstrip("/") for loc in locs}
    for url in required:
        key = url.rstrip("/")
        if key not in normalized:
            fail(f"missing required URL: {url}")
        else:
            ok(f"includes {url.replace(BASE, '') or '/'}")

    forbidden_fragments = ["/login", "/signup", "/dashboard", "/api/"]
    for loc in locs:
        for frag in forbidden_fragments:
            if frag in loc:
                fail(f"forbidden path in sitemap: {loc}")
                break

    # EN + tr/de/es localized sitemap entries (see LOCALIZED_SITEMAP_LOCALES in app/sitemap.ts)
    SITEMAP_LOCALE_MULTIPLIER = 4  # en + tr + de + es

    if not any("/case-studies/" in loc for loc in locs):
        fail("no case study detail URLs in sitemap")
    else:
        cs_in_sitemap = sum(1 for loc in locs if "/case-studies/" in loc)
        cs_slugs = count_case_studies()
        cs_expected = cs_slugs * SITEMAP_LOCALE_MULTIPLIER
        if cs_in_sitemap != cs_expected:
            fail(
                f"case study URL count mismatch: sitemap={cs_in_sitemap} "
                f"expected={cs_expected} ({cs_slugs} slugs × {SITEMAP_LOCALE_MULTIPLIER} locales)"
            )
        else:
            ok(
                f"{cs_in_sitemap} case study URLs "
                f"({cs_slugs} slugs × {SITEMAP_LOCALE_MULTIPLIER} locales)"
            )

        # Spot-check that localized prefixes exist for case studies
        for prefix in ("/tr/case-studies/", "/de/case-studies/", "/es/case-studies/"):
            if not any(prefix in loc for loc in locs):
                fail(f"missing localized case studies for {prefix}")
            else:
                ok(f"includes localized {prefix.rstrip('/')}")

    sample = [loc for loc in locs if "/case-studies/" in loc][:3]
    for url in sample:
        sc, _ = curl(url)
        if sc != 200:
            fail(f"case study page {url} HTTP {sc}")
        else:
            ok(f"sample case study 200: {url.replace(BASE, '')}")

    robots_code, robots = curl(f"{BASE}/robots.txt")
    if robots_code != 200:
        fail(f"robots.txt HTTP {robots_code}")
    elif "sitemap.xml" not in robots.lower():
        fail("robots.txt missing sitemap reference")
    else:
        ok("robots.txt references sitemap.xml")

    print()
    if FAILURES:
        print(f"=== Result: FAIL ({len(FAILURES)} issue(s)) ===")
        return 1
    print("=== Result: PASS ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
