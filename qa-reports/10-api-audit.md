# API Endpoint Audit

**Target:** `https://qrbanner.com`  
**Tested:** 2026-07-05 09:40 UTC  
**Endpoints:** 93 route files, 137 HTTP probes

## Summary

| Metric | Count |
|--------|-------|
| Live failures (5xx/network) | 0 |
| Timeouts | 0 |
| Slow (>2000ms) | 0 |
| Missing auth (heuristic) | 0 |
| Missing rate limit | 0 |
| Missing validation (POST/PUT/PATCH) | 0 |

## All endpoints (live probe)

| Method | Path | Status | ms | Verdict |
|--------|------|--------|-----|---------|
| GET | `/api/account/usage` | 401 | 303 | OK_AUTH |
| GET | `/api/admin/audit-log` | 403 | 227 | OK_AUTH |
| GET | `/api/admin/blog` | 401 | 204 | OK_AUTH |
| POST | `/api/admin/blog` | 401 | 235 | OK_AUTH |
| DELETE | `/api/admin/blog/__id__` | 401 | 237 | OK_AUTH |
| GET | `/api/admin/blog/__id__` | 401 | 206 | OK_AUTH |
| PATCH | `/api/admin/blog/__id__` | 401 | 213 | OK_AUTH |
| GET | `/api/admin/site-settings` | 403 | 225 | OK_AUTH |
| PATCH | `/api/admin/site-settings` | 403 | 224 | OK_AUTH |
| GET | `/api/admin/stats` | 403 | 233 | OK_AUTH |
| GET | `/api/admin/users` | 403 | 215 | OK_AUTH |
| PATCH | `/api/admin/users` | 403 | 214 | OK_AUTH |
| DELETE | `/api/auth/api-key` | 401 | 208 | OK_AUTH |
| GET | `/api/auth/api-key` | 401 | 230 | OK_AUTH |
| POST | `/api/auth/api-key` | 401 | 242 | OK_AUTH |
| POST | `/api/auth/change-password` | 401 | 204 | OK_AUTH |
| POST | `/api/auth/forgot-password` | 403 | 228 | OK_AUTH |
| GET | `/api/auth/mfa` | 401 | 230 | OK_AUTH |
| POST | `/api/auth/mfa/disable` | 401 | 203 | OK_AUTH |
| POST | `/api/auth/mfa/enable` | 401 | 228 | OK_AUTH |
| POST | `/api/auth/mfa/setup` | 401 | 222 | OK_AUTH |
| POST | `/api/auth/mfa/verify-session` | 401 | 251 | OK_AUTH |
| PUT | `/api/auth/profile` | 401 | 222 | OK_AUTH |
| POST | `/api/auth/reset-password` | 400 | 219 | OK_REJECT |
| POST | `/api/auth/saml/acs` | 307 | 222 | REDIRECT |
| GET | `/api/auth/saml/info` | 400 | 238 | OK_REJECT |
| GET | `/api/auth/saml/login` | 200 | 516 | OK |
| GET | `/api/auth/saml/metadata` | 400 | 230 | OK_REJECT |
| GET | `/api/auth/sso-policy` | 400 | 232 | OK_REJECT |
| GET | `/api/automations` | 401 | 219 | OK_AUTH |
| POST | `/api/automations` | 401 | 213 | OK_AUTH |
| DELETE | `/api/automations/__id__` | 401 | 210 | OK_AUTH |
| PATCH | `/api/automations/__id__` | 401 | 238 | OK_AUTH |
| GET | `/api/automations/logs` | 401 | 230 | OK_AUTH |
| POST | `/api/billing/checkout` | 400 | 223 | OK_REJECT |
| POST | `/api/billing/portal` | 401 | 231 | OK_AUTH |
| GET | `/api/billing/status` | 200 | 251 | OK |
| POST | `/api/billing/webhook` | 400 | 221 | OK_REJECT |
| POST | `/api/campaign/create` | 401 | 216 | OK_AUTH |
| POST | `/api/campaign/generate` | 401 | 211 | OK_AUTH |
| GET | `/api/campaigns` | 401 | 240 | OK_AUTH |
| POST | `/api/campaigns` | 401 | 214 | OK_AUTH |
| DELETE | `/api/campaigns/__id__` | 401 | 229 | OK_AUTH |
| GET | `/api/campaigns/__id__` | 401 | 227 | OK_AUTH |
| PATCH | `/api/campaigns/__id__` | 401 | 211 | OK_AUTH |
| POST | `/api/contact/inquiry` | 403 | 204 | OK_AUTH |
| GET | `/api/dashboard/analytics` | 401 | 223 | OK_AUTH |
| GET | `/api/domains` | 401 | 215 | OK_AUTH |
| POST | `/api/domains` | 401 | 238 | OK_AUTH |
| DELETE | `/api/domains/__id__` | 401 | 239 | OK_AUTH |
| PATCH | `/api/domains/__id__` | 401 | 236 | OK_AUTH |
| POST | `/api/domains/__id__/verify` | 401 | 207 | OK_AUTH |
| GET | `/api/folders` | 401 | 243 | OK_AUTH |
| POST | `/api/folders` | 401 | 238 | OK_AUTH |
| DELETE | `/api/folders/__id__` | 401 | 236 | OK_AUTH |
| PATCH | `/api/folders/__id__` | 401 | 225 | OK_AUTH |
| GET | `/api/health` | 200 | 218 | OK |
| GET | `/api/invite/__token__` | 404 | 234 | OK_REJECT |
| POST | `/api/invite/__token__` | 401 | 254 | OK_AUTH |
| POST | `/api/landing-cta` | 400 | 216 | OK_REJECT |
| POST | `/api/landing-page/generate-copy` | 401 | 234 | OK_AUTH |
| POST | `/api/leads` | 403 | 230 | OK_AUTH |
| POST | `/api/marketplace/connect/onboard` | 401 | 223 | OK_AUTH |
| GET | `/api/marketplace/listings` | 200 | 224 | OK |
| POST | `/api/marketplace/listings` | 401 | 242 | OK_AUTH |
| DELETE | `/api/marketplace/listings/__id__` | 401 | 270 | OK_AUTH |
| GET | `/api/marketplace/listings/__id__` | 404 | 213 | OK_REJECT |
| PATCH | `/api/marketplace/listings/__id__` | 401 | 226 | OK_AUTH |
| POST | `/api/marketplace/purchase` | 401 | 236 | OK_AUTH |
| GET | `/api/marketplace/seller` | 401 | 222 | OK_AUTH |
| PATCH | `/api/marketplace/seller` | 401 | 220 | OK_AUTH |
| GET | `/api/media` | 401 | 225 | OK_AUTH |
| DELETE | `/api/media/__id__` | 401 | 243 | OK_AUTH |
| GET | `/api/mobile/v1/qr` | 401 | 204 | OK_AUTH |
| GET | `/api/mobile/v1/qr/__id__` | 401 | 222 | OK_AUTH |
| GET | `/api/mobile/v1/summary` | 401 | 227 | OK_AUTH |
| GET | `/api/openapi.json` | 200 | 231 | OK |
| GET | `/api/public/stats` | 200 | 271 | OK |
| GET | `/api/qr` | 401 | 225 | OK_AUTH |
| POST | `/api/qr` | 401 | 233 | OK_AUTH |
| DELETE | `/api/qr/__id__` | 401 | 226 | OK_AUTH |
| GET | `/api/qr/__id__` | 401 | 205 | OK_AUTH |
| POST | `/api/qr/__id__` | 401 | 222 | OK_AUTH |
| PUT | `/api/qr/__id__` | 401 | 272 | OK_AUTH |
| GET | `/api/qr/__id__/analytics` | 401 | 246 | OK_AUTH |
| GET | `/api/qr/__id__/leads` | 401 | 232 | OK_AUTH |
| POST | `/api/qr/ai-restyle` | 401 | 205 | OK_AUTH |
| POST | `/api/qr/bulk` | 401 | 234 | OK_AUTH |
| POST | `/api/qr/bulk-actions` | 401 | 223 | OK_AUTH |
| POST | `/api/qr/organize` | 401 | 220 | OK_AUTH |
| GET | `/api/referral` | 401 | 221 | OK_AUTH |
| PATCH | `/api/referral` | 401 | 220 | OK_AUTH |
| POST | `/api/referral/claim-reward` | 401 | 222 | OK_AUTH |
| GET | `/api/referral/lookup` | 200 | 226 | OK |
| POST | `/api/scan/geo` | 400 | 220 | OK_REJECT |
| GET | `/api/scim/v2/Schemas` | 200 | 224 | OK |
| GET | `/api/scim/v2/ServiceProviderConfig` | 200 | 238 | OK |
| GET | `/api/scim/v2/Users` | 401 | 232 | OK_AUTH |
| POST | `/api/scim/v2/Users` | 401 | 221 | OK_AUTH |
| DELETE | `/api/scim/v2/Users/__id__` | 401 | 226 | OK_AUTH |
| GET | `/api/scim/v2/Users/__id__` | 401 | 241 | OK_AUTH |
| PATCH | `/api/scim/v2/Users/__id__` | 401 | 234 | OK_AUTH |
| PUT | `/api/scim/v2/Users/__id__` | 401 | 225 | OK_AUTH |
| POST | `/api/signup` | 403 | 219 | OK_AUTH |
| GET | `/api/site-settings` | 200 | 246 | OK |
| GET | `/api/templates` | 401 | 209 | OK_AUTH |
| POST | `/api/templates` | 401 | 242 | OK_AUTH |
| DELETE | `/api/templates/__id__` | 401 | 211 | OK_AUTH |
| POST | `/api/upload` | 401 | 219 | OK_AUTH |
| GET | `/api/v1` | 401 | 218 | OK_AUTH |
| GET | `/api/v1/folders` | 401 | 220 | OK_AUTH |
| POST | `/api/v1/folders` | 401 | 205 | OK_AUTH |
| DELETE | `/api/v1/folders/__id__` | 401 | 219 | OK_AUTH |
| GET | `/api/v1/folders/__id__` | 401 | 210 | OK_AUTH |
| PATCH | `/api/v1/folders/__id__` | 401 | 221 | OK_AUTH |
| GET | `/api/v1/qr` | 401 | 219 | OK_AUTH |
| POST | `/api/v1/qr` | 401 | 220 | OK_AUTH |
| DELETE | `/api/v1/qr/__id__` | 401 | 245 | OK_AUTH |
| GET | `/api/v1/qr/__id__` | 401 | 225 | OK_AUTH |
| PATCH | `/api/v1/qr/__id__` | 401 | 243 | OK_AUTH |
| POST | `/api/verify` | 400 | 213 | OK_REJECT |
| POST | `/api/verify/resend` | 400 | 238 | OK_REJECT |
| GET | `/api/webhooks` | 401 | 232 | OK_AUTH |
| POST | `/api/webhooks` | 401 | 243 | OK_AUTH |
| DELETE | `/api/webhooks/__id__` | 401 | 209 | OK_AUTH |
| PATCH | `/api/webhooks/__id__` | 401 | 245 | OK_AUTH |
| GET | `/api/webhooks/deliveries` | 401 | 236 | OK_AUTH |
| GET | `/api/workspace` | 401 | 228 | OK_AUTH |
| POST | `/api/workspace` | 401 | 229 | OK_AUTH |
| GET | `/api/workspace/clients` | 401 | 230 | OK_AUTH |
| POST | `/api/workspace/clients` | 401 | 230 | OK_AUTH |
| DELETE | `/api/workspace/clients/__id__` | 401 | 230 | OK_AUTH |
| PATCH | `/api/workspace/clients/__id__` | 401 | 204 | OK_AUTH |
| GET | `/api/workspace/enterprise` | 401 | 222 | OK_AUTH |
| PATCH | `/api/workspace/enterprise` | 401 | 226 | OK_AUTH |
| GET | `/api/workspace/members` | 401 | 244 | OK_AUTH |
| POST | `/api/workspace/members` | 401 | 246 | OK_AUTH |