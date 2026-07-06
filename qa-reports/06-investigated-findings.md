# QA Report — Investigated Findings (triaged)

**Target:** `https://qrbanner.com`  
**Audit date:** 2026-07-05  
**Method:** Live sequential probes + manual follow-up on every failure

---

## Severity legend

| Level | Meaning |
|-------|---------|
| **P0** | Production broken for real users |
| **P1** | Degraded UX / console errors / misconfiguration |
| **P2** | Expected without auth / test noise / config gap |
| **FP** | False positive — not a product defect |

---

## P0 — SAML redirect uses localhost in production

**Status:** ✅ **Resolved** (2026-07-06, customer-ux Pack 3)

**Endpoint:** `GET /api/auth/saml/login`  
**Was:** HTTP 307 → `https://localhost:3000/login?error=saml_workspace_required`  
**Fix:** SAML login/metadata routes build redirects with `siteBaseUrl()` / public origin instead of `req.url` internal host.

---

## P1 — React hydration mismatch on `/pricing`

**Status:** ✅ **Resolved** (commit `bc346ba`)

**Page:** `/pricing` (HTTP 200)  
**Was:** Minified React errors #425 / #422 on load (SSR vs client mismatch).  
**Fix:** Locale SSR sync via root layout + pricing provider hydration alignment.

---

## P1 — `/api/referral/claim-reward` returns 503 before auth check

**Status:** ✅ **Resolved** (customer-ux Pack 4)

**Endpoint:** `POST /api/referral/claim-reward`  
**Was:** HTTP 503 when Stripe coupon env missing; Paddle-only production.  
**Fix:** Reward is a **30-day Pro plan grant** (`planGrantExpiresAt`) — no Stripe coupon. Auth checked first (401 without session).

---

## P2 — `/qr/create` triggers `/api/domains` 401 in console

**Status:** ✅ **Resolved**

**Page:** `/qr/create`  
**Was:** `GET /api/domains` → 401 for unauthenticated visitors.  
**Fix:** `useScanBaseUrl` only fetches custom domains when `useSession().status === 'authenticated'`.

---

## P2 — Unsupported locale paths return 404

**Pages:** `/de/pricing`, `/fr/features` → HTTP 404  
**Verified:** Middleware supports only `en` + `tr`. Sitemap contains **0** de/fr URLs (476 `/tr/*` URLs only).

**Verdict:** Not a regression — test included locales that are not shipped. `/tr/pricing` returns 200.

---

## FP — Next.js RSC prefetch `net::ERR_ABORTED`

**Pattern:** `GET https://qrbanner.com/tr/pricing?_rsc=... — net::ERR_ABORTED`  
**Count:** ~490 across page + flow tests

**Investigation:** All failures are `*_rsc=*` prefetch requests aborted when navigation completes or new RSC flight starts. Document/page HTTP status remains 200.

**Verdict:** Framework noise — exclude `?_rsc=` from failure metrics in future runs.

---

## FP — `/api/auth/saml/login` Python probe "FAIL_NETWORK"

**Cause:** Probe followed 307 to `https://localhost:3000/...` → connection refused on tester machine.

**Verdict:** Same underlying P0 SAML bug; not a separate network outage.

---

## FP — 404 page console error

**Page:** `/this-page-does-not-exist-qa-break` → HTTP 404 with public chrome (header + footer present). Console "404" is the document itself.

**Verdict:** Expected.

---

## User flows summary

| Flow | Functional result | Notes |
|------|-------------------|-------|
| Login empty submit | Stays on `/login` | PASS |
| Signup invalid email | Form blocks / no crash | PASS |
| Forgot password | Submitted without error UI crash | PASS |
| Enterprise XSS | No alert dialog | PASS |
| QR create wizard | Loads (TR H1) | WARN — domains 401 console |
| Pricing CTA | Visible | WARN — hydration errors |

All flows marked WARN only due to RSC abort noise or console warnings — no flow completely blocked except SAML (P0).

---

## API summary (after triage)

| Category | Count |
|----------|-------|
| Total probes | 137 |
| Protected (401/403) — expected | 118 |
| Success (200) — public | 7 |
| Valid rejection (400/404) | 10 |
| **Real defects** | **2** (SAML redirect, referral/Stripe 503) |
| Test artifact (SCIM path typo in probe) | 1 |

---

## Recommended action order

1. ~~Fix SAML redirect base URL (P0)~~ ✅
2. ~~Fix pricing hydration (P1)~~ ✅
3. ~~Referral reward under Paddle (P1)~~ ✅
4. ~~Silence `/api/domains` fetch for anonymous QR create (P2)~~ ✅
5. Update QA runner to ignore `?_rsc=` aborts and unsupported locales

---

## Raw artifacts

| File | Description |
|------|-------------|
| `raw-pages.json` | 62 pages — console + network |
| `raw-apis.json` | 137 API probes |
| `raw-flows.json` | 6 interactive flows |
| `api-inventory.json` | 93 route files discovered |

Re-run: `python scripts/run-senior-qa.py`
