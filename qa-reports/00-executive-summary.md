# Senior QA — Executive Summary

**Project:** QRbanner (`https://qrbanner.com`)  
**Report generated:** 2026-07-05 08:02 UTC  
**Last triage update:** 2026-07-06 (post customer-ux packs 1–4)  
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
| `/api/domains` 401 on guest `/qr/create` | `useScanBaseUrl` gates fetch behind authenticated session |

### Remaining (low impact)

| Item | Notes |
|------|-------|
| `/de/`, `/fr/` locale 404 | Expected — only `en` + `tr` shipped |
| `?_rsc=` prefetch aborts | Next.js framework noise; exclude from failure metrics |

**Functional flows:** Login, signup, forgot-password, QR wizard, pricing CTA, referral claim, SAML wizard — usable.

See [06-investigated-findings.md](./06-investigated-findings.md) for repro steps and resolution notes.
