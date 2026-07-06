# Senior QA — Executive Summary

**Project:** QRbanner (`https://qrbanner.com`)  
**Report generated:** 2026-07-05 08:02 UTC  
**Last triage update:** 2026-07-06 (post customer-ux packs 1–23)  
**Methodology:** Sequential live probes — no code assumptions.

## Scope

- Public page navigation with console + network capture
- All discovered API routes probed without authenticated session
- Interactive user flows (forms, auth UI)

## Results at a glance (original run)

| Pages tested | 62 |
| Pages with issues | 60 |
| Console errors (total) | 15 |
| Failed network requests | 490 |

| API probes | 137 |
| API critical failures | 2 |
| API rate limits | 0 |

| User flows | 6 |
| Flow failures | 6 |

## Report index

1. [Public Pages](./01-public-pages.md)
2. [API Endpoints](./02-api-endpoints.md)
3. [User Flows](./03-user-flows.md)
4. [Console Errors](./04-console-errors.md)
5. [Network Failures](./05-network-failures.md)
6. **[Investigated Findings (triaged)](./06-investigated-findings.md)** ← start here

## Triaged verdict (after investigation + fixes)

| Severity | Original | Resolved | Remaining |
|----------|----------|----------|-----------|
| **P0** | 1 | 1 | 0 |
| **P1** | 2 | 2 | 0 |
| **P2** | 2 | 1 | 1 |
| **FP** | ~490 | — | ~490 (RSC prefetch noise) |

### Resolved since original audit

| Item | Fix |
|------|-----|
| SAML redirect to `localhost:3000` | `siteBaseUrl()` in SAML routes (Pack 3) |
| Pricing React hydration #425/#422 | SSR locale sync + pricing hydration (commit `bc346ba`) |
| Referral reward 503 (Stripe-only) | 30-day Pro `planGrantExpiresAt` grant via Paddle stack (Pack 4) |
| `/api/domains` 401 on guest `/qr/create` | `useScanBaseUrl` gates fetch behind authenticated session (Pack 5) |
| Scan notification copy hardcoded EN | i18n keys in settings + help (Pack 5) |
| QR advanced / design / style editor EN leaks | Packs 6–8 — `qrFeatures`, design panels, style editor i18n |
| Analytics insights, heatmap, leads, date picker EN | Pack 9 |
| CSV export headers, QR categories, share/print titles EN | Pack 10 |
| Analytics device/OS labels, funnel stages, campaign `{{count}}` | Pack 11 |
| Form placeholders + aria-labels (UTM, geofence, pixels, SMTP, SAML, automations) | Pack 12 |
| Scan page password/guards/lead forms via `Accept-Language` | Pack 13 |
| Scheme redirect pages, landing defaults, pixel redirect, dialog a11y | Pack 14 |
| Geofence country names, A/B URL placeholder, frame label, social aria-labels | Pack 15 |
| Icon delete aria-labels, schedule timezone i18n, scan CTA analytics locale | Pack 16 |
| Team role/status badges, reseller client plan/status/fee, marketplace listing status | Pack 17 |
| Landing CTA + QR frame label locale defaults (`Continue`/`Scan me` sentinels) | Pack 18 |
| Plan names, price badges, marketplace prices, mockup preset labels | Pack 19 |
| Print template physical sizes, template select field options (Wi‑Fi/crypto) | Pack 20 |
| Analytics scan source labels, print use-case line, automation device select | Pack 21 |
| Analytics country names and A/B variant chart labels | Pack 22 |
| Scan simulation confidence/decoded copy, QR preview alt; localized analytics CSV/PDF dimension values | Pack 23 |

### Remaining (low impact / operational)

| Item | Notes |
|------|-------|
| `/de/`, `/fr/` locale 404 | **By design** — only `en` + `tr` shipped |
| `?_rsc=` prefetch aborts | **By design / FP** — Next.js framework noise; exclude from failure metrics |
| G2 / Capterra review links hidden | **Operational** — VPS env vars unset until profiles claimed; run `python scripts/verify-review-profiles.py` |
| Campaign AI `purpose` field English | **By design** — AI-generated content stored in English; UI labels are localized |
| Geo analytics city names | **By design** — stored English DB values; countries localized at display/export (Pack 22–23) |
| QA runner locale + RSC filters | Recommended for future automated runs (not a product defect) |

**Functional flows:** Login, signup, forgot-password, QR wizard, pricing CTA, referral claim, SAML wizard — usable.

See [06-investigated-findings.md](./06-investigated-findings.md) for repro steps, by-design notes, and resolution history.
