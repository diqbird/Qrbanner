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
    # C — Ads / GA4 (skip if no paid ads)
    # "https://ads.google.com/",
    # "https://analytics.google.com/",
    # D — Turnstile + Sentry (optional)
    "https://dash.cloudflare.com/?to=/:account/turnstile",
    "https://sentry.io/signup/",
]

CLICK_ORDER = """
After tabs open, do this in order (2026-07-20):

A) Search Console — DONE (owner)

B) G2 + Capterra (deferred — skip until ready)
   1. Claim/list from /reviews/g2-setup
   2. VPS: NEXT_PUBLIC_G2_REVIEW_URL + NEXT_PUBLIC_CAPTERRA_REVIEW_URL + rebuild

C) Google Ads — SKIPPED (no paid ads)

D1) Turnstile (Cloudflare tab)
   1. Add widget for qrbanner.com
   2. Send SITE_KEY + SECRET_KEY → agent runs set-vps-env + rebuild

D2) Sentry (sentry.io tab)
   1. Next.js project → DSN
   2. Send DSN → agent sets SENTRY_DSN + NEXT_PUBLIC_SENTRY_DSN + rebuild
"""


def main() -> int:
    print(CLICK_ORDER)
    for url in TABS:
        print(f"open {url}")
        webbrowser.open_new_tab(url)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
