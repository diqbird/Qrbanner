"""Open the remaining launch console tabs in the default browser.

Run after code/deploy gates are green. You must click inside each Google/vendor UI.
"""
from __future__ import annotations

import webbrowser

TABS = [
    # A — GSC
    "https://search.google.com/search-console?resource_id=sc-domain%3Aqrbanner.com",
    "https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Aqrbanner.com",
    "https://search.google.com/search-console/inspect?resource_id=sc-domain%3Aqrbanner.com&id=https://qrbanner.com/",
    # B — G2 / Capterra
    "https://qrbanner.com/reviews/g2-setup",
    "https://www.g2.com/products/new",
    "https://www.capterra.com/vendors/",
    # C — Ads / GA4
    "https://ads.google.com/",
    "https://analytics.google.com/",
]

CLICK_ORDER = """
After tabs open, do this in order:

A) Search Console (logged-in property qrbanner.com)
   1. Sitemaps -> submit/resubmit https://qrbanner.com/sitemap.xml
   2. URL Inspection -> Request indexing for:
      /  /pricing  /tr/pricing  /templates  /llms.txt

B) G2 + Capterra (from /reviews/g2-setup)
   1. Claim/list product
   2. Copy review URLs into VPS .env:
      NEXT_PUBLIC_G2_REVIEW_URL=...
      NEXT_PUBLIC_CAPTERRA_REVIEW_URL=...
   3. pm2 restart qrbanner (or redeploy)

C) Google Ads (CONSOLE_A_D.md)
   1. Link GA4 G-3LY6YZDDD2
   2. Import sign_up + first_qr_created
   3. Realtime test
   4. Import Editor CSVs (Paused) then Enable Create
"""


def main() -> int:
    print(CLICK_ORDER)
    for url in TABS:
        print(f"open {url}")
        webbrowser.open_new_tab(url)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
