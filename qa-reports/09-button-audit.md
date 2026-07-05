# Button Audit Report

**Static inventory:** 701 buttons in TSX
**Live click audit:** 31 public pages, 1139 interactions

## Summary

| Metric | Count |
|--------|-------|
| Click PASS | 1107 |
| Click WARN (console) | 32 |
| Click FAIL | 0 |
| Empty onClick / hash href (static) | 0 |

## Fixes applied

1. **Cmd+K Search (`Ara ⌘K`)** — `components/ui/command.tsx`: added hidden `DialogTitle`
2. **Share (`Paylaş`)** — `components/qr/qr-preview.tsx`: data URL → blob without `fetch()` (CSP)

## WARN details (before fix)

### `Ara` (28 pages)

- **Component:** public header search / pricing CTA / locale switch
- **OnClick:** opens dialog / checkout / locale
- **Console:** `DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users.

If you want to hide the `DialogTitle`, you can wrap it with our VisuallyHidden component.

For mor
- **API:** [{'url': 'https://qrbanner.com/api/billing/status', 'status': 200, 'method': 'GET'}, {'url': 'https://qrbanner.com/api/billing/status', 'status': 200, 'method': 'GET'}]

### `Agency'ye yükselt` (1 pages)

- **Component:** public header search / pricing CTA / locale switch
- **OnClick:** opens dialog / checkout / locale
- **Console:** Failed to load resource: the server responded with a status of 401 ()
- **API:** [{'url': 'https://qrbanner.com/api/billing/checkout', 'status': 401, 'method': 'POST'}, {'url': 'https://qrbanner.com/api/site-settings', 'status': 200, 'method': 'GET'}, {'url': 'https://qrbanner.com/api/auth/session', 'status': 200, 'method': 'GET'}]

### `Paylaş` (1 pages)

- **Component:** public header search / pricing CTA / locale switch
- **OnClick:** opens dialog / checkout / locale
- **Console:** Connecting to 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUQAAAFrCAYAAACpEPAlAAAQAElEQVR4AeydCbAlVXnHzxAG2YZdicZIoYAIpjCyjMBEURBccCVR4xCCDhqHqIioUChooIZiogJOEJdAoACDhYCKVOFWbhmDIwMqChIRcdzAYGAGht0

### `TR` (1 pages)

- **Component:** public header search / pricing CTA / locale switch
- **OnClick:** opens dialog / checkout / locale
- **Console:** Failed to load resource: the server responded with a status of 404 ()
- **API:** [{'url': 'https://qrbanner.com/api/site-settings', 'status': 200, 'method': 'GET'}, {'url': 'https://qrbanner.com/api/auth/session', 'status': 200, 'method': 'GET'}]

### `QRbanner` (1 pages)

- **Component:** public header search / pricing CTA / locale switch
- **OnClick:** opens dialog / checkout / locale
- **Console:** Failed to load resource: the server responded with a status of 502 ()
- **API:** [{'url': 'https://qrbanner.com/api/billing/status', 'status': 200, 'method': 'GET'}, {'url': 'https://qrbanner.com/api/billing/status', 'status': 502, 'method': 'GET'}]

## Sample inventory row format

| File | Line | Component | OnClick | Route |
|------|------|-----------|---------|-------|
| `app/error.tsx` | 36 | Error | `—` | — |
| `app/error.tsx` | 39 | Error | `—` | / |
| `app/error.tsx` | 36 | Error | `—` | — |
| `app/error.tsx` | 39 | Error | `—` | — |
| `app/global-error.tsx` | 26 | GlobalError | `—` | — |
| `app/(auth)/invite/[token]/page.tsx` | 99 | InvitePage | `—` | — |
| `app/(auth)/invite/[token]/page.tsx` | 108 | InvitePage | `acceptInvite` | — |
| `app/(auth)/invite/[token]/page.tsx` | 113 | InvitePage | `—` | — |
| `app/(auth)/invite/[token]/page.tsx` | 99 | InvitePage | `—` | — |
| `app/(auth)/invite/[token]/page.tsx` | 108 | InvitePage | `acceptInvite` | — |
| `app/(auth)/invite/[token]/page.tsx` | 113 | InvitePage | `—` | — |
| `app/(public)/affiliates/page.tsx` | 84 | page | `—` | — |
| `app/(public)/affiliates/page.tsx` | 92 | page | `—` | — |
| `app/(public)/affiliates/page.tsx` | 97 | page | `—` | — |
| `app/(public)/affiliates/page.tsx` | 102 | page | `—` | — |

_Full inventory: `qa-reports/button-inventory.json` (701 entries)_
_Full click log: `qa-reports/button-click-audit.json`_