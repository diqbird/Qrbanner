# Senior QA — Executive Summary

**Project:** QRbanner (`https://qrbanner.com`)  
**Report generated:** 2026-07-05 08:02 UTC  
**Methodology:** Sequential live probes — no code assumptions.

## Scope

- Public page navigation with console + network capture
- All discovered API routes probed without authenticated session
- Interactive user flows (forms, auth UI)

## Results at a glance

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

## Triaged verdict (after investigation)

| Severity | Count | Top items |
|----------|-------|-----------|
| **P0** | 1 | SAML login redirects to `localhost:3000` |
| **P1** | 2 | Pricing React hydration (#425/#422); referral reward 503 (Stripe-only) |
| **P2** | 2 | `/api/domains` 401 noise on `/qr/create`; unsupported `/de/` `/fr/` 404 |
| **FP** | ~490 | Next.js `?_rsc=` prefetch aborts (not user-facing failures) |

**Functional flows:** Login, signup, forgot-password, XSS probe, QR wizard, pricing CTA — all usable. SAML SSO broken for enterprise.

See [06-investigated-findings.md](./06-investigated-findings.md) for repro steps and root causes.
