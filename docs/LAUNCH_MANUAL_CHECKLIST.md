# Launch checklist — final status

## Agent scope: COMPLETE

| Gate | Result |
|------|--------|
| Job Ticket homepage + deploy | LIVE |
| Launch E2E | 19/0 PASS |
| Free plan limit (5) | PASS |
| URL safety (`javascript:`) | PASS (live 400) |
| Security audit | 20/0 PASS |
| GSC snippet readiness | PASS |
| Sitemap health (2449 URLs) | PASS |
| Ads paste URLs + Editor CSV SoT | PASS |
| `/reviews/g2-setup` | LIVE |

**Cannot finish in agent browser (no Google/vendor login):** GSC console clicks, Ads A→D UI, G2/Capterra product claim.  
**2026-07-20:** GSC agent clicks skipped after repeated no-session; Ads URL/CSV preflight reconfirmed PASS; `/reviews/g2-setup` live TR/EN.

Open remaining owner tabs:
```bash
python scripts/open-launch-manual-tabs.py
```

---

## Owner-only (you click) — do in this order

### A — Google Search Console (SKIPPED by agent — you must click)
1. Property `qrbanner.com` / `sc-domain:qrbanner.com`
2. Sitemaps → submit `https://qrbanner.com/sitemap.xml`
3. URL Inspection → Request indexing for `/`, `/pricing`, `/tr/pricing`, `/templates`, `/llms.txt`

### B — G2 / Capterra (next after A)
1. https://qrbanner.com/reviews/g2-setup → **G2’de ürün ekle** / Capterra vendors
2. Claim with `@qrbanner.com` email
3. VPS `.env`: `NEXT_PUBLIC_G2_REVIEW_URL` + `NEXT_PUBLIC_CAPTERRA_REVIEW_URL` → restart

### C — Google Ads A→D
Follow `marketing/google-ads/CONSOLE_A_D.md` (GA4 `G-3LY6YZDDD2` → import conversions → CSV from `marketing/google-ads/editor-csv*`).

### D — Optional
Turnstile / Sentry · PSI when Google quota recovers
