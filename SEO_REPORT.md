# QRbanner SEO Report

**Date:** 2026-07-16  
**Scope:** Technical SEO, Schema.org, Core Web Vitals enablers, accessibility, AI-search readiness  
**Deploy pack:** `scripts/manifests/seo-technical-pass.json`

---

## 1. Current issues (pre-pass)

| Priority | Issue |
|----------|--------|
| P0 | Cookie locale TR/DE/ES + unprefixed URLs → canonical ≠ visible URL |
| P0 | JSON-LD `WebPage` / breadcrumbs used English-only URLs and `inLanguage: en-US` |
| P0 | Homepage FAQ schema always English |
| P1 | `/status` in sitemap while page is `noIndex` |
| P1 | `robots.txt` missing disallows for `/pay`, `/admin`, auth recovery, MFA |
| P1 | Marketplace listing metadata returned `{}` when unpublished |
| P1 | Marketplace browse lacked `ItemList`; detail lacked `Product`/`Offer` |
| P1 | Referral FAQ on page without `FAQPage` JSON-LD |
| P1 | Blog posts used `og:type=website` instead of `article` |
| P1 | Admin layout lacked sitewide `noindex` |
| P2 | Customer logos used raw `<img>` |
| P2 | `SoftwareApplication` advertised a single free `Offer` |

Already strong (unchanged): central `pageMetadata`, dual hreflang (metadata + `<link>`), large sitemap with locales, Consent Mode + deferred analytics, security headers via middleware, public `<header>` / `<main>` / `<footer>`, FAQ/pricing schema on key pages.

---

## 2. Fixes applied

### Locale / canonical integrity
- Middleware **308 redirect**: when `qrb-locale` is `tr|de|es` and the request hits a localizable **unprefixed** path, redirect to `/{locale}{path}` so the address bar matches canonical/hreflang.
- Breadcrumbs: locale-aware JSON-LD URLs + `useLocalePath()` for link `href`s.

### Metadata & robots
- `pageMetadata` supports `openGraphType: 'article'`, `publishedTime` / `modifiedTime`, optional Twitter `site`/`creator` from `NEXT_PUBLIC_SOCIAL_TWITTER`.
- Blog posts emit **article** Open Graph with dates.
- `app/robots.ts`: disallow `/pay`, `/admin/`, `/studio/`, `/forgot-password`, `/reset-password`, `/mfa-verify` (keep `/qr/create` allowed).
- Admin root layout: `robots: { index: false, follow: false }`.
- Sitemap: remove `/status`; include localized `/marketplace/{id}` entries.

### Schema.org (JSON-LD)
- `webPageJsonLd` / `breadcrumbJsonLd` / `itemListJsonLd` / `comparisonPageJsonLd`: optional `locale` → localized absolute URL + BCP-47 `inLanguage`.
- `getHomepageFaqItems(locale)` for locale-matched FAQ schema.
- `websiteJsonLd`: multi-language + `SearchAction` → `/templates?q={search_term_string}`.
- `softwareApplicationJsonLd`: honest `AggregateOffer` (free → Pro price band).
- New `marketplaceListingJsonLd` (`Product` + `Offer`).
- Marketplace browse: `WebPage` + `ItemList`.
- Marketplace detail: `WebPage` + `Product`, semantic `<article>`, enriched titles, `noIndex` when unpublished.
- Referral: `FAQPage` from on-page FAQ keys.
- Pricing / FAQ pages pass `locale` into `webPageJsonLd`.

### Performance / a11y
- Customer logos: `next/image` with width/height + lazy loading (local SVGs).
- Marketplace detail: single `<h1>`, `<article>` wrapper.

---

## 3. Files modified

| File | Change |
|------|--------|
| `lib/seo.ts` | Locale helpers, metadata article OG, schema upgrades, marketplace Product |
| `middleware.ts` | Cookie-locale → prefixed URL 308 |
| `app/robots.ts` | Expanded disallow list |
| `app/sitemap.ts` | Drop `/status`; localized marketplace IDs |
| `components/seo/public-breadcrumbs.tsx` | Locale paths + JSON-LD |
| `app/(public)/page.tsx` | Localized homepage FAQ schema |
| `app/(public)/faq/page.tsx` | Locale on WebPage |
| `app/(public)/pricing/page.tsx` | Locale on WebPage |
| `app/(public)/referral/page.tsx` | FAQPage JSON-LD |
| `app/(public)/blog/[slug]/page.tsx` | Article OG + dates |
| `app/(public)/marketplace/page.tsx` | ItemList + locale WebPage |
| `app/(public)/marketplace/[id]/page.tsx` | Product schema, noindex unpublished |
| `app/(admin)/layout.tsx` | noindex |
| `components/landing/customer-logos.tsx` | `next/image` |
| `next.config.js` | CDN cache for `/apps`, `/marketplace`, trust/enterprise hubs |
| `SEO_REPORT.md` | This report |
| `scripts/manifests/seo-technical-pass.json` | Deploy manifest |

---

## 4. Remaining recommendations

### Done in follow-up pack (2026-07-17)
- Locale passed into remaining marketing `webPageJsonLd` call sites (+ geo hub/city/sector, vs comparisons).
- Geo city×sector: visible FAQ + `FAQPage` JSON-LD (3 Q&As per combo).
- `/apps`: HowTo + FAQPage JSON-LD + on-page FAQ (honest no App Store copy).
- Locale-aware internal links: programmatic shell/pricing, internal-links hubs, geo hub, marketplace browse.

### Done in follow-up pack (2026-07-17 b)
- Blog article images use `next/image` (AVIF/WebP) with width/height + descriptive alt fallback; rare hosts fall back to `<img>`.
- CSP shared via `lib/csp.cjs` — applied in both middleware (`lib/security-headers.ts`) and `next.config.js` headers.
- WebPage JSON-LD on solutions / qr-types / use-cases / case-study detail routes; related links locale-aware.

### Done in follow-up pack (2026-07-17 c)
- `/llms.txt` + `/llms-full.txt` (Markdown AI brief per llmstxt.org); excluded from middleware matcher.
- Brand logos page: `ItemList` of `ImageObject` for `/logos/*.svg` assets.

### Done in follow-up pack (2026-07-17 d)
- **SearchAction fulfilled:** `/templates?q={search_term_string}` now seeds + syncs the marketplace filter (`?q=`).
- Template detail pages emit locale-aware `WebPage` JSON-LD.
- Blog → marketplace hub link; customers logos use `next/image`.

### Done in follow-up pack (2026-07-17 e)
- CSP hardening: `object-src 'none'`, `frame-ancestors 'self'`, `manifest-src 'self'`, prod `upgrade-insecure-requests`.
- Per-request script **nonce** via middleware (`x-nonce`) → root layout analytics Scripts; static CSP only on middleware-skipped routes (avoids dual-CSP AND).
- `'strict-dynamic'` deferred until post-deploy console violation audit (keeps host allowlists for GTM/unpkg).

### Done in follow-up pack (2026-07-17 f)
- Blog locale URLs unlocked: `/tr|/de|/es/blog` (+ post slugs) with hreflang/sitemap; all 65 posts have TR/DE/ES bodies.
- Changelog aliases now redirect to locale blog hubs.

### Done in follow-up pack (2026-07-17 g)
- Solutions detail pages emit `FAQPage` JSON-LD from localized FAQ (EN/TR/DE/ES).
- Solution ROI CTA + homepage industries / use-cases / case-studies teasers use locale paths; industries cards use `localizeSolutionPage`.

### Done in follow-up pack (2026-07-17 h)
- Blog → solution/template deep links via static slug map (`lib/blog/related-links.ts`) into `ProgrammaticInternalLinks` extraLinks.

### Done in follow-up pack (2026-07-17 i)
- Pricing page wrapped in `PremiumShell` and restyled to match homepage tokens (`ph-card`, gradient canvas, reveal motion, rounded CTAs). Billing/checkout logic unchanged.

### Done in follow-up pack (2026-07-17 j)
- GSC automated readiness extended in `scripts/verify-sitemap-health.py`: inspection targets (`/`, `/pricing`, `/tr/pricing`, `/templates`, `/llms.txt`) + `google-site-verification` meta. Sitemap health already PASS (2449 URLs). Console clicks remain manual (below).

### Done in follow-up pack (2026-07-17 k)
- CSP nonce path now includes `'strict-dynamic'` (`lib/csp.cjs`); host allowlists + `'unsafe-inline'` kept as legacy fallback. Static middleware-skipped CSP unchanged.

### Done in follow-up pack (2026-07-17 l)
- CSP: explicit `style-src-attr 'unsafe-inline'` (React `style={{}}`). Style-element nonce deferred — Framer Motion / Crisp inject un-nonced `<style>` tags; adding a style nonce would ignore `'unsafe-inline'` in CSP3 and break UI.
- Features page wrapped in `PremiumShell` (match home/pricing tokens, reveal motion, dark CTA band).

### Done in follow-up pack (2026-07-17 m)
- FAQ, vs index, and contact hubs wrapped in `PremiumShell` (locale paths on vs/contact links).
- Contact / sales inquiry form a11y: `autocomplete`, `aria-required`, enterprise `fieldset`/`legend`.

### Done in follow-up pack (2026-07-17 n)
- Solutions index + enterprise marketing pages wrapped in `PremiumShell`; solution cards and enterprise trust links use `localizePath`.

### Done in follow-up pack (2026-07-17 o)
- Templates + use-cases hubs wrapped in `PremiumShell`. Use-cases index now renders localized titles/descriptions (was mapping `localizeUseCasePage` then ignoring it).

### Done in follow-up pack (2026-07-17 p)
- About, QR types index, and developers hubs wrapped in `PremiumShell` with localized marketing links.

### Still open (manual / billing only)
1. **GSC:** Search Console clicks in checklist below (site already verification-ready; sitemap health PASS).
2. **Ads / reviews:** claim G2/Capterra when ready; Ads A–D remains deferred (billing).
3. **CSP:** style-src-elem nonce only after Motion/Crisp style injection is nonced or replaced.

### GSC checklist (manual)
1. Confirm property for `https://qrbanner.com` (verification meta live: `xFJ2mgJtq8mkZibVZWBdq1bAvM0RhBl53tQS_QFvqMg`).
2. Submit `https://qrbanner.com/sitemap.xml` (Sitemaps → Add / Resubmit).
3. URL Inspection: `/`, `/pricing`, `/tr/pricing`, `/templates`, `/llms.txt`.
4. Monitor Coverage / Page indexing for “Alternate page with proper canonical” after locale 308s.
5. Core Web Vitals (CrUX): watch LCP on mobile home + templates.

**Automated gate:** `python scripts/verify-sitemap-health.py` (sitemap + GSC readiness). Soft-404 aliases: `/compare`→`/vs`, `/solutions/restaurants`→`/solutions/restaurant-menu`, `/changelog`→`/blog`.

---

## 5. Lighthouse expectations

| Category | Expectation after deploy | Notes |
|----------|--------------------------|--------|
| SEO | **95–100** | Robots/sitemap/canonical/schema fixes |
| Accessibility | **90–100** | Existing skip/nav/ARIA; logos/images improved |
| Best Practices | **95–100** | Security headers already present |
| Performance | **85–95+** | Depends on device/throttling; hero + analytics still dominate LCP/JS |

Run PageSpeed Insights on `/`, `/pricing`, `/templates`, `/tr`, `/marketplace` after deploy.

---

## 6. Core Web Vitals improvements

| Metric | What this pass did | Still watch |
|--------|--------------------|-------------|
| **LCP** | Homepage FAQ schema is SSR; logos use optimized `Image` | Hero media / font still main LCP candidates |
| **CLS** | Logo width/height set | Dynamic dashboard widgets out of scope |
| **INP** | No new client JS on hot paths | Consent + analytics remain deferred |
| **TTFB** | ISR/`revalidate` unchanged on marketing pages | VPS/DB for marketplace queries |

---

## 7. Structured data summary

| Type | Where |
|------|--------|
| Organization, WebSite (+ SearchAction), SoftwareApplication (AggregateOffer) | Public layout |
| FAQPage | Home (locale), FAQ, Pricing, Referral, Solutions detail, Geo sector, Apps |
| WebPage | Key marketing pages (+ locale when passed) |
| BreadcrumbList | Public breadcrumbs (locale-aware) |
| Product / Offer (plans) | Pricing |
| Product / Offer (listing) | Marketplace detail |
| ItemList | Marketplace browse, vs index |
| Article (JSON-LD already in blog) + OG article | Blog posts |

Validate with [Rich Results Test](https://search.google.com/test/rich-results) on `/`, `/pricing`, `/referral`, `/marketplace`.

---

## 8. Accessibility summary

- Skip link + landmark regions already in public layout.
- Breadcrumbs: `aria-label`, `aria-current="page"`.
- Marketplace detail: one H1 inside `<article>`.
- Customer logos: descriptive `alt` from industry label.
- Contact/sales inquiry labels + autocomplete wired; procurement form can be audited separately. Watch muted-text contrast in dark mode.

---

## 9. Performance summary

- Consent-gated GA/GTM (`lazyOnload`) unchanged — correct for INP/privacy.
- `next/font` with `display: 'swap'` unchanged.
- Logo wall moved to `next/image` (local SVGs).
- Avoided design refactors; no new heavy client bundles.

---

## 10. Future SEO roadmap

1. Locale-complete JSON-LD on all programmatic detail routes.  
2. Entity-rich FAQ blocks on geo + industry templates (AI Overview / Perplexity).  
3. Quarterly Core Web Vitals review in Search Console + CrUX.  
4. Expand internal links from blog → templates / use-cases / marketplace.  
5. When Ads billing is live: conversion imports (does not affect organic SEO).  
6. Keep `/llms.txt` product links current when major hubs ship.

---

## Validation checklist (post-deploy)

- [ ] `https://qrbanner.com/robots.txt` lists new disallows  
- [ ] Sitemap omits `/status`; includes `/marketplace`  
- [ ] With locale cookie `tr`, visit `/pricing` → 308 → `/tr/pricing`  
- [ ] View-source homepage FAQ JSON-LD matches page language  
- [ ] Rich Results Test: no critical schema errors on home/pricing/referral  
