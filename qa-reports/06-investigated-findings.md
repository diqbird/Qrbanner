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

**Endpoint:** `GET /api/auth/saml/login`  
**Observed:** HTTP 307 → `https://localhost:3000/login?error=saml_workspace_required`  
**Repro:**

```bash
curl -sI "https://qrbanner.com/api/auth/saml/login"
# location: https://localhost:3000/login?error=saml_workspace_required
```

**Impact:** Enterprise SAML login cannot redirect users back to the live site. Any workspace attempting SSO will land on an unreachable host.

**Root cause (verified via response headers):** `NextResponse.redirect(new URL('/login?...', req.url))` resolves against an internal base URL (`localhost:3000`) instead of the public site origin on VPS.

**Recommended fix:** Use `siteBaseUrl()` / `x-forwarded-host` when building redirect URLs in SAML routes (same pattern as billing checkout).

---

## P1 — React hydration mismatch on `/pricing`

**Page:** `/pricing` (HTTP 200)  
**Console:**

- `Minified React error #425` — text content mismatch (SSR vs client)
- `Minified React error #422` — hydration recovered with client render

**Impact:** Pricing page hydrates with errors. Users may see flicker, incorrect initial prices, or SEO/crawler inconsistency.

**Repro:** Open `/pricing` in Chrome → DevTools Console → errors appear on load.

**Next step:** Run local dev build with `NODE_ENV=development` on pricing component tree; compare SSR HTML vs client (often dynamic dates, locale, or Paddle script injection).

---

## P1 — `/api/referral/claim-reward` returns 503 before auth check

**Endpoint:** `POST /api/referral/claim-reward` (no session)  
**Observed:** HTTP 503 `{"error":"Referral reward is not configured yet"}`

**Impact:** Misleading status — endpoint is Stripe-coupon based but production billing is Paddle-only. Referral reward flow is effectively dead.

**Root cause (verified):** Route checks `referralRewardCouponId()` + `isStripeConfigured()` before session validation.

**Recommendation:** Either migrate reward claim to Paddle, or return 501/feature-disabled with docs; check auth first (401) for API consistency.

---

## P2 — `/qr/create` triggers `/api/domains` 401 in console

**Page:** `/qr/create`  
**Network:** `GET /api/domains` → 401

**Root cause:** `lib/use-scan-base-url.ts` fetches domains for logged-in custom-domain base URL; unauthenticated visitors still trigger the hook.

**Impact:** Console noise only; wizard still loads (H1 visible).

**Recommendation:** Gate fetch behind session or swallow 401 without console error.

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

1. Fix SAML redirect base URL (P0)
2. Fix pricing hydration (P1)
3. Decide referral reward strategy under Paddle (P1)
4. Silence `/api/domains` fetch for anonymous QR create (P2)
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
