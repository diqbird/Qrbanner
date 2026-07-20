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

### A — Google Search Console
**DONE (owner 2026-07-20):** sitemap + URL Inspection.

### B — G2 / Capterra
**DEFERRED (owner 2026-07-20):** sonra claim + URL; site G2/Capterra olmadan çalışır (trust şerit gizli).
1. https://qrbanner.com/reviews/g2-setup → **G2’de ürün ekle** / Capterra vendors
2. Claim with `@qrbanner.com` email
3. VPS `.env`: `NEXT_PUBLIC_G2_REVIEW_URL` + `NEXT_PUBLIC_CAPTERRA_REVIEW_URL` → restart

### C — Google Ads A→D
**SKIPPED (owner choice 2026-07-20):** ücretli reklam yok — A→D yapılmayacak. İleride Ads açılırsa: `marketing/google-ads/CONSOLE_A_D.md`.

### D — Optional

**Turnstile / Sentry — DEFERRED (owner 2026-07-20):** anahtar gelince VPS’e yazılır; unset = skip (site çalışır).
- Turnstile: Site Key + Secret → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` + rebuild
- Sentry: DSN → `SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN` + rebuild

**PSI / Lighthouse:** Google API 429. Local LH home was perf **~59–63**. Round 1 (Reveal/opacity) live. Round 2: idle-defer hero QR ticket, trust without framer, lazy site search, Fraunces 600/700 only.

---

## Owner launch status (2026-07-20)

| Item | Status |
|------|--------|
| GSC | DONE |
| Ads A→D | SKIPPED (no paid ads) |
| G2 / Capterra | DEFERRED |
| Turnstile / Sentry | DEFERRED |
| PSI (local LH home) | perf 63 — optimize later |
