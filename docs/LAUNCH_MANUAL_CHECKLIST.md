# Launch manual checklist (cannot be fully automated)

Agent completed code, deploy gates, and E2E. These steps need your Google / vendor logins.

## A — Google Search Console
1. Open https://search.google.com/search-console → property `qrbanner.com`
2. Sitemaps → resubmit `https://qrbanner.com/sitemap.xml`
3. URL Inspection → request indexing for:
   - `/`
   - `/pricing`
   - `/tr/pricing`
   - `/templates`
   - `/llms.txt`
4. Confirm readiness anytime: `python scripts/verify-gsc-snippet-health.py`

## B — G2 / Capterra
1. Claim / list product on G2 and Capterra (see `/reviews/g2-setup`)
2. After live review URLs exist, set on VPS `.env`:
   - `NEXT_PUBLIC_G2_REVIEW_URL=...`
   - `NEXT_PUBLIC_CAPTERRA_REVIEW_URL=...`
3. Redeploy or restart so homepage trust chips light up

## C — Google Ads A→D
Follow `marketing/google-ads/CONSOLE_A_D.md` in order:
1. Link GA4 `G-3LY6YZDDD2`
2. Import conversions (`sign_up`, `first_qr_created`)
3. Realtime smoke test
4. Import Editor CSVs (Paused) then enable Create campaign

Preflight:
```bash
python scripts/verify-ads-paste-urls.py
python scripts/generate-ads-editor-csv.py
```

## D — Optional polish after claim
- Turnstile / Sentry env keys when ready
- PSI score recheck after Google quota recovers (was 429)
