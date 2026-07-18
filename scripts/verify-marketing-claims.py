#!/usr/bin/env python3
"""P4-27: Verify social proof / case study labeling on live site + source strings."""
import os
import re
import subprocess
import sys

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


def curl(url: str, follow: bool = True) -> tuple[int, str, str]:
    args = ["curl.exe", "-sL", "-w", "\n%{http_code}\n%{url_effective}", url]
    if not follow:
        args.insert(1, "--max-redirs")
        args.insert(2, "0")
    r = subprocess.run(
        args,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    body = r.stdout or r.stderr or ""
    parts = body.rsplit("\n", 2)
    if len(parts) >= 3:
        code = int(parts[-2].strip() or "0")
        final_url = parts[-1].strip()
        html = "\n".join(parts[:-2])
        return code, html, final_url
    return 0, body, url


def page_contains(html: str, *needles: str) -> bool:
    lower = html.lower()
    return all(n.lower() in lower for n in needles)


def check_i18n() -> None:
    print("--- Static i18n strings ---")
    en_path = os.path.join(ROOT, "lib", "i18n", "en.ts")
    text = open(en_path, encoding="utf-8").read()

    bad_phrases = [
        "Real-world outcomes from teams",
        "Trusted by teams in",
    ]
    for phrase in bad_phrases:
        if phrase in text:
            fail(f"en.ts still contains misleading phrase: {phrase!r}")
        else:
            ok(f"en.ts removed {phrase!r}")

    # Current honest-label wording (customers.logosTitle / caseStudiesIndex copy)
    required = [
        "Illustrative scenario — not a verified customer story",
        "not customer logos",
        "not verified customer",
    ]
    for phrase in required:
        if phrase not in text:
            fail(f"en.ts missing honest label: {phrase!r}")
        else:
            ok(f"en.ts has honest label")


def main() -> int:
    print(f"=== Marketing claims verification ({BASE}) ===\n")
    check_i18n()

    print("\n--- Live pages ---")

    code, html, _ = curl(f"{BASE}/case-studies")
    if code != 200:
        fail(f"/case-studies HTTP {code}")
    elif not page_contains(html, "Illustrative", "not verified"):
        fail("/case-studies missing scenario disclaimer")
    else:
        ok("/case-studies shows illustrative / not verified disclaimer")

    slug = "multi-location-restaurant-menus"
    code, html, _ = curl(f"{BASE}/case-studies/{slug}")
    if code != 200:
        fail(f"/case-studies/{slug} HTTP {code}")
    elif "Illustrative scenario" not in html and "not a verified" not in html.lower():
        fail(f"/case-studies/{slug} missing scenario badge")
    else:
        ok(f"/case-studies/{slug} has scenario badge")

    code, html, _ = curl(f"{BASE}/customers")
    if code != 200:
        fail(f"/customers HTTP {code}")
    elif "not customer logos" not in html.lower() and "industry labels only" not in html.lower():
        fail("/customers missing logo disclaimer")
    else:
        ok("/customers shows logo disclaimer")

    code, html, _ = curl(f"{BASE}/")
    if code != 200:
        fail(f"homepage HTTP {code}")
    elif page_contains(html, "★★★★★", "5★", "5-star"):
        fail("homepage shows star ratings without G2 profile")
    else:
        ok("homepage has no fake star ratings")

    code, html, final = curl(f"{BASE}/reviews/prompts", follow=False)
    if code in (301, 302, 307, 308) and "/reviews" in final:
        ok("/reviews/prompts redirects away (astroturfing page removed)")
    elif "/reviews" in final and "review prompts you can copy" not in html.lower():
        ok("/reviews/prompts no longer serves copy-paste prompts")
    else:
        fail(f"/reviews/prompts unexpected response {code} -> {final}")

    code, html, _ = curl(f"{BASE}/reviews")
    if code != 200:
        fail(f"/reviews HTTP {code}")
    elif "G2 and Capterra profiles are being set up" in html or "collecting feedback from early users" in html.lower():
        ok("/reviews honest empty-state when G2/Capterra unset")
    else:
        ok("/reviews page loads")

    print()
    if FAILURES:
        print(f"=== Result: FAIL ({len(FAILURES)} issue(s)) ===")
        return 1
    print("=== Result: PASS ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
