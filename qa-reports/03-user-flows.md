# QA Report — User Flows

**Target:** `https://qrbanner.com`  
**Tested:** 2026-07-05T08:01:25.087Z

## Login — empty submit — WARN

- Opened /login
- Clicked submit without credentials
- Still on login: true

### Network failures
- GET https://qrbanner.com/forgot-password?_rsc=7khhj — net::ERR_ABORTED
- GET https://qrbanner.com/signup?_rsc=7khhj — net::ERR_ABORTED

## Signup — UI reachability — WARN

- Opened /signup
- Filled invalid email
- Submitted form

### Network failures
- GET https://qrbanner.com/terms?_rsc=1bse4 — net::ERR_ABORTED
- GET https://qrbanner.com/privacy?_rsc=1bse4 — net::ERR_ABORTED
- GET https://qrbanner.com/login?callbackUrl=%2Fqr%2Fcreate%3Fquick%3D1%26onboarding%3D1&_rsc=1bse4 — net::ERR_ABORTED
- GET https://qrbanner.com/cookies?_rsc=1bse4 — net::ERR_ABORTED

## Forgot password — submit — WARN

- Opened /forgot-password
- Submitted forgot-password for qa-break@example.com

### Network failures
- GET https://qrbanner.com/reset-password?email=qa-break%40example.com&_rsc=1oqhu — net::ERR_ABORTED

## Enterprise contact — XSS probe — WARN

- Opened /enterprise
- Submitted XSS payload in name field
- Alert dialog fired: false

### Network failures
- GET https://qrbanner.com/tr?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/tr/features?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/tr/solutions?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/tr/integrations?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/tr/pricing?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/qr/create?quick=1&_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/login?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/privacy?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/cookies?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/tr/about?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/signup?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/tr/qr-types?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/tr/use-cases/product-packaging?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/tr/refund?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/tr/referral?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/tr/geo?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/tr/use-cases/real-estate-listings?_rsc=1aiif — net::ERR_ABORTED
- GET https://qrbanner.com/tr/contact?_rsc=1aiif — net::ERR_ABORTED

## QR create — load wizard — WARN

- Opened /qr/create
- H1: QR Kodu Oluştur

### Console errors
- Failed to load resource: the server responded with a status of 401 ()

### Network failures
- GET https://qrbanner.com/tr?_rsc=1ac9v — net::ERR_ABORTED
- GET https://qrbanner.com/tr/features?_rsc=1ac9v — net::ERR_ABORTED
- GET https://qrbanner.com/tr/solutions?_rsc=1ac9v — net::ERR_ABORTED
- GET https://qrbanner.com/tr/templates?_rsc=1ac9v — net::ERR_ABORTED
- GET https://qrbanner.com/tr/pricing?_rsc=1ac9v — net::ERR_ABORTED
- GET https://qrbanner.com/cookies?_rsc=1ac9v — net::ERR_ABORTED

## Pricing — page + CTA — WARN

- Opened /pricing
- Signup CTA visible

### Console errors
- Minified React error #425; visit https://react.dev/errors/425 for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
- Minified React error #422; visit https://react.dev/errors/422 for the full message or use the non-minified dev environment for full errors and additional helpful warnings.

### Network failures
- GET https://qrbanner.com/tr?_rsc=10bql — net::ERR_ABORTED
- GET https://qrbanner.com/tr/features?_rsc=10bql — net::ERR_ABORTED
- GET https://qrbanner.com/tr/solutions?_rsc=10bql — net::ERR_ABORTED
- GET https://qrbanner.com/tr/templates?_rsc=10bql — net::ERR_ABORTED
- GET https://qrbanner.com/tr/pricing?_rsc=10bql — net::ERR_ABORTED
- GET https://qrbanner.com/tr/faq?_rsc=10bql — net::ERR_ABORTED
- GET https://qrbanner.com/login?_rsc=10bql — net::ERR_ABORTED
