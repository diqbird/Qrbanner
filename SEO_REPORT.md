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
| `SEO_REPORT.md` | This report |
| `scripts/manifests/seo-technical-pass.json` | Deploy manifest |

---

## 4. Remaining recommendations

1. **Pass `locale` into every `webPageJsonLd` call** on geo, solutions, QR types, use-cases, integrations, case-study detail (helpers already support it; many call sites still default to `en`).
2. **Geo / programmatic thinness:** add 2–3 unique FAQ Q&As per city×sector template to strengthen AI Overview eligibility.
3. **`/apps`:** HowTo + FAQ for PWA install; keep honest “no App Store yet” copy; optional `MobileApplication` only if accurate.
4. **Blog body images:** migrate `blog-article-body` raw `<img>` → `next/image` with meaningful `alt`.
5. **Internal linking:** wire `useLocalePath` on programmatic shells and marketplace CTAs that still hardcode `/…`.
6. **SearchAction:** if Cmd+K gains a public shareable URL, point `urlTemplate` there instead of templates search.
7. **CSP alignment:** mirror middleware CSP into `next.config.js` headers for non-middleware responses.
8. **GSC:** submit updated sitemap; monitor “Alternate page with proper canonical” after locale redirects.
9. **Ads / reviews:** claim G2/Capterra when ready; Ads A–D remains deferred (billing).

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
| FAQPage | Home (locale), FAQ, Pricing, Referral |
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
- Remaining: audit form labels on contact/procurement; contrast in dark mode for muted text.

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
3. DigitalAsset / ImageObject for brand logos page.  
4. Optional `llms.txt` + concise entity summary for AI crawlers.  
5. Quarterly Core Web Vitals review in Search Console + CrUX.  
6. Expand internal links from blog → templates / use-cases / marketplace.  
7. When Ads billing is live: conversion imports (does not affect organic SEO).

---

## Validation checklist (post-deploy)

- [ ] `https://qrbanner.com/robots.txt` lists new disallows  
- [ ] Sitemap omits `/status`; includes `/marketplace`  
- [ ] With locale cookie `tr`, visit `/pricing` → 308 → `/tr/pricing`  
- [ ] View-source homepage FAQ JSON-LD matches page language  
- [ ] Rich Results Test: no critical schema errors on home/pricing/referral  
