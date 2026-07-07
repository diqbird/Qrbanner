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

## API summary (after triage)

| Category | Count |
|----------|-------|
| Total probes | 137 |
| Protected (401/403) — expected | 118 |
| Success (200) — public | 7 |
| Valid rejection (400/404) | 10 |
| **Real defects** | **2** (SAML redirect, referral/Stripe 503) — both fixed |
| Test artifact (SCIM path typo in probe) | 1 |

---

## User flows summary

| Flow | Functional result | Notes |
|------|-------------------|-------|
| Login empty submit | Stays on `/login` | PASS |
| Signup invalid email | Form blocks / no crash | PASS |
| Forgot password | Submitted without error UI crash | PASS |
| Enterprise XSS | No alert dialog | PASS |
| QR create wizard | Loads (TR H1) | PASS — domains 401 fixed (Pack 5) |
| Pricing CTA | Visible | PASS — hydration fixed (`bc346ba`) |

All flows functional. Historical WARN flags (domains 401, hydration) are resolved. RSC abort noise remains FP only.

---

## By design (not defects)

| Topic | Verdict |
|-------|---------|
| `/de/`, `/fr/` → 404 | Middleware ships `en` + `tr` only; sitemap has no de/fr URLs |
| `?_rsc=` `net::ERR_ABORTED` | Next.js RSC prefetch; page HTTP 200 — exclude from metrics |
| Campaign wizard AI `purpose` | English prose from model output; surrounding UI is i18n |
| Analytics geo country/city | English values in DB; localized labels via resolver where mapped |
| G2 / Capterra footer links | Hidden when `NEXT_PUBLIC_G2_REVIEW_URL` / `NEXT_PUBLIC_CAPTERRA_REVIEW_URL` unset |

**Review profile workflow (Pack 12):**

```bash
python scripts/verify-review-profiles.py          # check VPS env + URL reachability
python scripts/configure-review-profiles.py \
  --g2-url <url> --capterra-url <url>           # set env + optional rebuild
```

---

## Customer-UX packs 5–22 (summary)

| Pack | Commit | Focus |
|------|--------|-------|
| 5 | `32594e4` | Scan notify i18n, referral billing gate, QA triage |
| 6 | `63b39a6` | QR advanced feature panels i18n |
| 7 | `40e082a` | Design step panels i18n |
| 8 | `02845ea` | Style editor color/pattern/frame i18n |
| 9 | `e80f033` | Analytics insights, heatmap, leads, date picker |
| 10 | `d5e8dbb` | CSV export i18n, QR categories, share/print titles |
| 11 | (prior) | Analytics device/OS labels, funnel stages, campaign counts |
| 12 | `15ef3e2` | Placeholders + aria-labels i18n; review-profile scripts; QA doc refresh |
| 13 | `04d8c41` | Scan page i18n: password/guards/lead forms via `Accept-Language` |
| 14 | `2f6d485` | Scheme redirect pages, landing defaults, pixel redirect, dialog a11y |
| 15 | `ebff430` | Geofence countries, A/B URL placeholder, frame label, social aria-labels |
| 16 | `6630524` | Icon delete aria-labels, schedule timezone i18n, scan CTA analytics locale |
| 17 | `3dc0afd` | Team/reseller/marketplace status badges i18n; QA doc refresh |
| 18 | `7451084` | Landing CTA + QR frame label locale defaults; empty editor defaults |
| 19 | `a777aca` | Plan display names, price badges, marketplace prices, mockup presets |
| 20 | `cfa6f46` | Print template physical sizes; Wi‑Fi/crypto template select options |
| 21 | `e514468` | Scan source analytics labels; print use-case; automation device select |
| 22 | `f9b3125` | Analytics country display via Intl; A/B variant chart labels |
| 23 | `eb3ad38` | Scan simulation decoded/confidence i18n; localized analytics CSV/PDF values |
| 24 | `506289b` | Analytics city labels; scan notification email TR/EN; API key example i18n |
| 25 | `e4d9dd0` | Verification + password-reset email TR/EN; signup stores preferredLocale |
| 26 | `4d54741` | Automation action defaults, SMTP test email, log error labels |
| 27 | (this deploy) | Automation template var labels; localized values in Slack/email/webhook dispatch |
| 28 | (this deploy) | Dashboard sidebar account name fallback; automation builder select closed-state labels |
| 29 | (this deploy) | Landing builder, QR export size, reseller plan, and SSO provider select closed-state labels |
| 30 | (this deploy) | Locale-aware dates/numbers; status/SEO labels; folder and workspace select labels |
| 31 | (this deploy) | Analytics number formatting; empty-value labels; scannability OK; bulk category labels |
| 32 | (this deploy) | Analytics PDF locale dates; brand kit dates; API cURL example; style preview label |
| 33 | (this deploy) | Dashboard stat numbers; plan usage meters; webhook event label; PDF export counts |
| 34 | (this deploy) | Bulk CSV template examples; template quota badges; webhook/automation counts |
| 35 | (this deploy) | Bulk import flow number formatting across header, preview, result, and plan usage |
| 36 | (this deploy) | Campaign wizard, dashboard bulk, referral, analytics, and marketplace counts |

---

## Recommended action order

1. ~~Fix SAML redirect base URL (P0)~~ ✅
2. ~~Fix pricing hydration (P1)~~ ✅
3. ~~Referral reward under Paddle (P1)~~ ✅
4. ~~Silence `/api/domains` fetch for anonymous QR create (P2)~~ ✅
5. Update QA runner to ignore `?_rsc=` aborts and unsupported locales
6. Claim G2/Capterra profiles → run `configure-review-profiles.py` when URLs are live

---

## Raw artifacts

| File | Description |
|------|-------------|
| `raw-pages.json` | 62 pages — console + network |
| `raw-apis.json` | 137 API probes |
| `raw-flows.json` | 6 interactive flows |
| `api-inventory.json` | 93 route files discovered |

Re-run: `python scripts/run-senior-qa.py`
