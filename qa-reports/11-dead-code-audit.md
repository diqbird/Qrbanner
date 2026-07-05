# Dead Code Audit

**Project:** qrbanner  
**Scanned:** 2026-07-05  
**Method:** Static import graph + depcheck + manual verification  
**Tool:** `python scripts/qa/scan-dead-code.py` → `qa-reports/dead-code-scan.json`

## Summary

| Category | Safe to delete | Keep (false positive) |
|----------|---------------:|----------------------:|
| Components | ~30 | 191 |
| Hooks | 0 | 6 |
| lib modules | 2 confirmed | blog/i18n chain via relative imports |
| Providers/contexts | 0 | 4 |
| API routes | 0–1 optional | 93 |
| App routes/pages | 0 | 61 |
| npm dependencies | ~35 | dynamic/build deps |

---

## Components — silinebilir

### Legacy / replaced (yüksek güven)

| File | Reason |
|------|--------|
| `components/analytics/site-google-analytics.tsx` | Replaced by `deferred-site-analytics.tsx` |
| `components/analytics/site-google-tag-manager.tsx` | Same |
| `components/layouts/app-shell.tsx` | Zero imports |
| `components/layouts/auth-layout.tsx` | App uses `app/(auth)/layout.tsx` instead |
| `components/layouts/page-header.tsx` | Zero imports |
| `components/ui/task-card.tsx` | Zero imports |

### Orphan toast stack (Sonner kullanılıyor)

| File | Reason |
|------|--------|
| `components/ui/toaster.tsx` | Not mounted; `providers.tsx` uses `ui/sonner` |
| `components/ui/use-toast.ts` | Only used by orphan toaster |
| `components/ui/toast.tsx` | Only used by orphan toaster |

### Unused shadcn UI primitives (zero `@/components/ui/...` imports)

| File | Paired npm package |
|------|-------------------|
| `components/ui/accordion.tsx` | `@radix-ui/react-accordion` |
| `components/ui/alert.tsx` | — |
| `components/ui/alert-dialog.tsx` | `@radix-ui/react-alert-dialog` |
| `components/ui/animate.tsx` | — (framer-motion used directly elsewhere) |
| `components/ui/aspect-ratio.tsx` | `@radix-ui/react-aspect-ratio` |
| `components/ui/avatar.tsx` | `@radix-ui/react-avatar` |
| `components/ui/breadcrumb.tsx` | — |
| `components/ui/carousel.tsx` | `embla-carousel-react` |
| `components/ui/context-menu.tsx` | `@radix-ui/react-context-menu` |
| `components/ui/drawer.tsx` | `vaul` |
| `components/ui/form.tsx` | `react-hook-form`, `@hookform/resolvers` |
| `components/ui/hover-card.tsx` | `@radix-ui/react-hover-card` |
| `components/ui/input-otp.tsx` | `input-otp` |
| `components/ui/menubar.tsx` | `@radix-ui/react-menubar` |
| `components/ui/navigation-menu.tsx` | `@radix-ui/react-navigation-menu` |
| `components/ui/pagination.tsx` | — |
| `components/ui/radio-group.tsx` | `@radix-ui/react-radio-group` |
| `components/ui/resizable.tsx` | `react-resizable-panels` |
| `components/ui/scroll-area.tsx` | `@radix-ui/react-scroll-area` |
| `components/ui/sheet.tsx` | (radix dialog primitive) |
| `components/ui/toggle.tsx` | `@radix-ui/react-toggle` |
| `components/ui/toggle-group.tsx` | `@radix-ui/react-toggle-group` |
| `components/ui/tooltip.tsx` | `@radix-ui/react-tooltip` |

**Total: ~30 component files**

---

## Hooks — silinebilir

**None.** All 6 hooks are imported:

- `use-billing-status.ts`
- `use-plan-checkout.ts`
- `use-debounced-value.ts`
- `use-qr-feature-fields.ts`
- `use-qr-style-history.ts`
- `use-unsaved-changes-guard.ts`

---

## lib — silinebilir

| File | Reason |
|------|--------|
| `lib/session-guard.ts` | `requireAuthenticatedSession`, `sessionUserId` — zero imports |
| `lib/types.ts` | Expense tracker types — zero imports (leftover) |

**Do NOT delete** (false positives):

- `lib/api-mfa-exempt.ts` — used in `middleware.ts`
- `lib/s3.ts`, `lib/gs1.ts`, `lib/i18n/*` — relative imports
- `lib/blog/posts/*` — registered in `posts-service.ts`

---

## Providers / context — silinebilir

**None.** Active stack in `components/providers.tsx`:

- `SessionProvider` (next-auth)
- `LanguageProvider`
- `SiteSettingsProvider`
- `ThemeProvider`
- `Toaster` (sonner)

---

## API routes — silinebilir

| Route | Verdict |
|-------|---------|
| `GET /api/public/stats` | **Optional** — no client `fetch`; SSR uses `lib/public-stats` directly. Keep if OpenAPI/external consumers need it. |
| All other 92 routes | **Keep** — auth, billing, SCIM, mobile, v1 API |

SCIM routes (`/api/scim/v2/*`) have no frontend refs by design (IdP integration).

---

## App routes / pages — silinebilir

**None recommended.** All 61 `page.tsx` files are linked from sitemap, nav, or e2e tests (e.g. `/reviews/g2-setup`, `/downloads/enterprise-overview`).

---

## npm dependencies — silinebilir

### High confidence (no import in codebase)

| Package | Notes |
|---------|-------|
| `@floating-ui/react` | Unused |
| `@headlessui/react` | Unused |
| `@hookform/resolvers` | Only orphan `ui/form.tsx` |
| `@tanstack/react-query` | Unused (fetch used directly) |
| `chart.js` | Unused (`recharts` used) |
| `cookie` | Unused |
| `csv` | Unused — code uses **`csv-parse`** (missing from package.json!) |
| `dayjs` | Unused (`date-fns` used) |
| `formik` | Unused |
| `gray-matter` | Unused (blog is TS modules, not MD files) |
| `jotai` | Unused |
| `lodash` | Unused |
| `maplibre-gl` | Unused (`react-globe.gl` used for GPS) |
| `plotly.js` | Unused |
| `react-chartjs-2` | Unused |
| `react-datepicker` | Unused (`react-day-picker` used) |
| `react-hot-toast` | Unused (`sonner` used) |
| `react-is` | Unused |
| `react-plotly.js` | Unused |
| `react-select` | Unused (`@radix-ui/react-select` used) |
| `react-use` | Unused |
| `swr` | Unused |
| `tailwind-scrollbar-hide` | Not in tailwind config |
| `webpack` | Should not be direct dependency (Next bundles) |
| `yup` | Unused |
| `zod` | Unused |
| `zustand` | Unused |

### Remove with unused UI components

`@radix-ui/react-accordion`, `-alert-dialog`, `-aspect-ratio`, `-avatar`, `-context-menu`, `-hover-card`, `-menubar`, `-navigation-menu`, `-radio-group`, `-scroll-area`, `-toast`, `-toggle`, `-toggle-group`, `-tooltip`, `vaul`, `input-otp`, `react-resizable-panels`, `embla-carousel-react`, `react-hook-form`

### Keep (false positive / dynamic / build)

| Package | Why |
|---------|-----|
| `dotenv` | Prisma seed / scripts |
| `sharp` | Next.js image pipeline |
| `ioredis` | Dynamic import in `redis-client.ts` |
| `jsqr`, `jszip`, `qrcode`, `qr-code-styling` | Dynamic imports |
| `react-dom` | React |
| `autoprefixer`, `postcss`, `tailwindcss` | Build toolchain |
| `@types/*`, `eslint*`, `typescript`, `prisma`, `tsx` | Dev tooling |

### Fix (not delete)

- Add `csv-parse` to `dependencies` (used in `lib/bulk-csv.ts`)

---

## Root artifacts — silinebilir (opsiyonel)

| File | Reason |
|------|--------|
| `providers-out.txt` | Debug output |
| `build-out.txt` | Build log |
| `qa-reports/btn-build.txt` | Build log |
| `qa-reports/build-log.txt` | Build log |

---

## Recommended cleanup order

1. Delete orphan toast stack + legacy analytics/layout components (~8 files)
2. Delete unused shadcn UI files (~22 files) + matching Radix/npm packages
3. Delete `lib/session-guard.ts`, `lib/types.ts`
4. Run `yarn build` + `npm run qa:apis`
5. Add `csv-parse`, remove `csv` from package.json
6. Optional: remove `GET /api/public/stats` if external API not needed

**Estimated bundle/install savings:** ~25–35 unused npm packages, ~30 component files (~15% of components/).
