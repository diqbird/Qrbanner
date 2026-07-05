# QA Report — API Endpoints

**Target:** `https://qrbanner.com`  
**Tested:** 2026-07-05T08:02:01.720643+00:00  
**Requests:** 137

## Summary

| Verdict | Count |
|---------|-------|
| FAIL_5XX | 1 |
| FAIL_NETWORK | 1 |
| OK_PROTECTED | 113 |
| OK_REDIRECT | 1 |
| OK_REJECTION | 13 |
| OK_SUCCESS | 8 |

## Critical failures (5xx / network)

### `GET /api/auth/saml/login`
- Status: **0**
- Error: `<urlopen error [WinError 10061] Hedef makine etkin olarak reddettiğinden bağlantı kurulamadı>`

### `POST /api/referral/claim-reward`
- Status: **503**
- Body: `{"error":"Referral reward is not configured yet"}`

## All endpoints

| Method | Path | Status | Verdict | ms |
|--------|------|--------|---------|-----|
| GET | `/api/account/usage` | 401 | OK_PROTECTED | 252 |
| GET | `/api/admin/audit-log` | 403 | OK_PROTECTED | 236 |
| GET | `/api/admin/blog` | 401 | OK_PROTECTED | 214 |
| POST | `/api/admin/blog` | 401 | OK_PROTECTED | 227 |
| DELETE | `/api/admin/blog/__id__` | 401 | OK_PROTECTED | 236 |
| GET | `/api/admin/blog/__id__` | 401 | OK_PROTECTED | 234 |
| PATCH | `/api/admin/blog/__id__` | 401 | OK_PROTECTED | 235 |
| GET | `/api/admin/site-settings` | 403 | OK_PROTECTED | 226 |
| PATCH | `/api/admin/site-settings` | 403 | OK_PROTECTED | 229 |
| GET | `/api/admin/stats` | 403 | OK_PROTECTED | 212 |
| GET | `/api/admin/users` | 403 | OK_PROTECTED | 224 |
| PATCH | `/api/admin/users` | 403 | OK_PROTECTED | 239 |
| DELETE | `/api/auth/api-key` | 401 | OK_PROTECTED | 212 |
| GET | `/api/auth/api-key` | 401 | OK_PROTECTED | 219 |
| POST | `/api/auth/api-key` | 401 | OK_PROTECTED | 218 |
| POST | `/api/auth/change-password` | 401 | OK_PROTECTED | 220 |
| POST | `/api/auth/forgot-password` | 403 | OK_PROTECTED | 216 |
| GET | `/api/auth/mfa` | 401 | OK_PROTECTED | 233 |
| POST | `/api/auth/mfa/disable` | 401 | OK_PROTECTED | 242 |
| POST | `/api/auth/mfa/enable` | 401 | OK_PROTECTED | 218 |
| POST | `/api/auth/mfa/setup` | 401 | OK_PROTECTED | 221 |
| POST | `/api/auth/mfa/verify-session` | 401 | OK_PROTECTED | 202 |
| PUT | `/api/auth/profile` | 401 | OK_PROTECTED | 229 |
| POST | `/api/auth/reset-password` | 400 | OK_REJECTION | 218 |
| POST | `/api/auth/saml/acs` | 307 | OK_REDIRECT | 272 |
| GET | `/api/auth/saml/info` | 400 | OK_REJECTION | 222 |
| GET | `/api/auth/saml/login` | 0 | FAIL_NETWORK | 4300 |
| GET | `/api/auth/saml/metadata` | 400 | OK_REJECTION | 238 |
| GET | `/api/auth/sso-policy` | 400 | OK_REJECTION | 230 |
| GET | `/api/automations` | 401 | OK_PROTECTED | 229 |
| POST | `/api/automations` | 401 | OK_PROTECTED | 217 |
| DELETE | `/api/automations/__id__` | 401 | OK_PROTECTED | 206 |
| PATCH | `/api/automations/__id__` | 401 | OK_PROTECTED | 215 |
| GET | `/api/automations/logs` | 401 | OK_PROTECTED | 218 |
| POST | `/api/billing/checkout` | 400 | OK_REJECTION | 197 |
| POST | `/api/billing/portal` | 401 | OK_PROTECTED | 221 |
| GET | `/api/billing/status` | 200 | OK_SUCCESS | 225 |
| POST | `/api/billing/webhook` | 400 | OK_REJECTION | 222 |
| POST | `/api/campaign/create` | 401 | OK_PROTECTED | 225 |
| POST | `/api/campaign/generate` | 401 | OK_PROTECTED | 202 |
| GET | `/api/campaigns` | 401 | OK_PROTECTED | 214 |
| POST | `/api/campaigns` | 401 | OK_PROTECTED | 219 |
| DELETE | `/api/campaigns/__id__` | 401 | OK_PROTECTED | 233 |
| GET | `/api/campaigns/__id__` | 401 | OK_PROTECTED | 233 |
| PATCH | `/api/campaigns/__id__` | 401 | OK_PROTECTED | 234 |
| POST | `/api/contact/inquiry` | 403 | OK_PROTECTED | 209 |
| GET | `/api/dashboard/analytics` | 401 | OK_PROTECTED | 231 |
| GET | `/api/domains` | 401 | OK_PROTECTED | 217 |
| POST | `/api/domains` | 401 | OK_PROTECTED | 208 |
| DELETE | `/api/domains/__id__` | 401 | OK_PROTECTED | 222 |
| PATCH | `/api/domains/__id__` | 401 | OK_PROTECTED | 218 |
| POST | `/api/domains/__id__/verify` | 401 | OK_PROTECTED | 231 |
| GET | `/api/folders` | 401 | OK_PROTECTED | 232 |
| POST | `/api/folders` | 401 | OK_PROTECTED | 239 |
| DELETE | `/api/folders/__id__` | 401 | OK_PROTECTED | 219 |
| PATCH | `/api/folders/__id__` | 401 | OK_PROTECTED | 231 |
| GET | `/api/health` | 200 | OK_SUCCESS | 223 |
| GET | `/api/invite/__token__` | 404 | OK_REJECTION | 225 |
| POST | `/api/invite/__token__` | 401 | OK_PROTECTED | 217 |
| POST | `/api/landing-cta` | 400 | OK_REJECTION | 219 |
| POST | `/api/landing-page/generate-copy` | 401 | OK_PROTECTED | 205 |
| POST | `/api/leads` | 403 | OK_PROTECTED | 211 |
| POST | `/api/marketplace/connect/onboard` | 401 | OK_PROTECTED | 231 |
| GET | `/api/marketplace/listings` | 200 | OK_SUCCESS | 205 |
| POST | `/api/marketplace/listings` | 401 | OK_PROTECTED | 221 |
| DELETE | `/api/marketplace/listings/__id__` | 401 | OK_PROTECTED | 222 |
| GET | `/api/marketplace/listings/__id__` | 404 | OK_REJECTION | 211 |
| PATCH | `/api/marketplace/listings/__id__` | 401 | OK_PROTECTED | 220 |
| POST | `/api/marketplace/purchase` | 401 | OK_PROTECTED | 222 |
| GET | `/api/marketplace/seller` | 401 | OK_PROTECTED | 211 |
| PATCH | `/api/marketplace/seller` | 401 | OK_PROTECTED | 224 |
| GET | `/api/media` | 401 | OK_PROTECTED | 218 |
| DELETE | `/api/media/__id__` | 401 | OK_PROTECTED | 275 |
| GET | `/api/mobile/v1/qr` | 401 | OK_PROTECTED | 229 |
| GET | `/api/mobile/v1/qr/__id__` | 401 | OK_PROTECTED | 233 |
| GET | `/api/mobile/v1/summary` | 401 | OK_PROTECTED | 201 |
| GET | `/api/openapi.json` | 200 | OK_SUCCESS | 222 |
| GET | `/api/public/stats` | 200 | OK_SUCCESS | 245 |
| GET | `/api/qr` | 401 | OK_PROTECTED | 230 |
| POST | `/api/qr` | 401 | OK_PROTECTED | 219 |
| DELETE | `/api/qr/__id__` | 401 | OK_PROTECTED | 228 |
| GET | `/api/qr/__id__` | 401 | OK_PROTECTED | 219 |
| POST | `/api/qr/__id__` | 401 | OK_PROTECTED | 227 |
| PUT | `/api/qr/__id__` | 401 | OK_PROTECTED | 222 |
| GET | `/api/qr/__id__/analytics` | 401 | OK_PROTECTED | 220 |
| GET | `/api/qr/__id__/leads` | 401 | OK_PROTECTED | 221 |
| POST | `/api/qr/ai-restyle` | 401 | OK_PROTECTED | 217 |
| POST | `/api/qr/bulk` | 401 | OK_PROTECTED | 222 |
| POST | `/api/qr/bulk-actions` | 401 | OK_PROTECTED | 222 |
| POST | `/api/qr/organize` | 401 | OK_PROTECTED | 224 |
| GET | `/api/referral` | 401 | OK_PROTECTED | 208 |
| PATCH | `/api/referral` | 401 | OK_PROTECTED | 224 |
| POST | `/api/referral/claim-reward` | 503 | FAIL_5XX | 232 |
| GET | `/api/referral/lookup` | 200 | OK_SUCCESS | 200 |
| POST | `/api/scan/geo` | 400 | OK_REJECTION | 227 |
| GET | `/api/scim/v2/Schemas` | 200 | OK_SUCCESS | 233 |
| GET | `/api/scim/v2/ServiceProviderConfig` | 404 | OK_REJECTION | 266 |
| GET | `/api/scim/v2/Users` | 401 | OK_PROTECTED | 215 |
| POST | `/api/scim/v2/Users` | 401 | OK_PROTECTED | 241 |
| DELETE | `/api/scim/v2/Users/__id__` | 401 | OK_PROTECTED | 198 |
| GET | `/api/scim/v2/Users/__id__` | 401 | OK_PROTECTED | 226 |
| PATCH | `/api/scim/v2/Users/__id__` | 401 | OK_PROTECTED | 229 |
| PUT | `/api/scim/v2/Users/__id__` | 401 | OK_PROTECTED | 216 |
| POST | `/api/signup` | 403 | OK_PROTECTED | 220 |
| GET | `/api/site-settings` | 200 | OK_SUCCESS | 197 |
| GET | `/api/templates` | 401 | OK_PROTECTED | 217 |
| POST | `/api/templates` | 401 | OK_PROTECTED | 226 |
| DELETE | `/api/templates/__id__` | 401 | OK_PROTECTED | 220 |
| POST | `/api/upload` | 401 | OK_PROTECTED | 222 |
| GET | `/api/v1` | 401 | OK_PROTECTED | 236 |
| GET | `/api/v1/folders` | 401 | OK_PROTECTED | 226 |
| POST | `/api/v1/folders` | 401 | OK_PROTECTED | 222 |
| DELETE | `/api/v1/folders/__id__` | 401 | OK_PROTECTED | 219 |
| GET | `/api/v1/folders/__id__` | 401 | OK_PROTECTED | 240 |
| PATCH | `/api/v1/folders/__id__` | 401 | OK_PROTECTED | 236 |
| GET | `/api/v1/qr` | 401 | OK_PROTECTED | 202 |
| POST | `/api/v1/qr` | 401 | OK_PROTECTED | 228 |
| DELETE | `/api/v1/qr/__id__` | 401 | OK_PROTECTED | 223 |
| GET | `/api/v1/qr/__id__` | 401 | OK_PROTECTED | 234 |
| PATCH | `/api/v1/qr/__id__` | 401 | OK_PROTECTED | 238 |
| POST | `/api/verify` | 400 | OK_REJECTION | 221 |
| POST | `/api/verify/resend` | 400 | OK_REJECTION | 443 |
| GET | `/api/webhooks` | 401 | OK_PROTECTED | 276 |
| POST | `/api/webhooks` | 401 | OK_PROTECTED | 309 |
| DELETE | `/api/webhooks/__id__` | 401 | OK_PROTECTED | 298 |
| PATCH | `/api/webhooks/__id__` | 401 | OK_PROTECTED | 391 |
| GET | `/api/webhooks/deliveries` | 401 | OK_PROTECTED | 440 |
| GET | `/api/workspace` | 401 | OK_PROTECTED | 386 |
| POST | `/api/workspace` | 401 | OK_PROTECTED | 357 |
| GET | `/api/workspace/clients` | 401 | OK_PROTECTED | 644 |
| POST | `/api/workspace/clients` | 401 | OK_PROTECTED | 257 |
| DELETE | `/api/workspace/clients/__id__` | 401 | OK_PROTECTED | 235 |
| PATCH | `/api/workspace/clients/__id__` | 401 | OK_PROTECTED | 260 |
| GET | `/api/workspace/enterprise` | 401 | OK_PROTECTED | 253 |
| PATCH | `/api/workspace/enterprise` | 401 | OK_PROTECTED | 238 |
| GET | `/api/workspace/members` | 401 | OK_PROTECTED | 241 |
| POST | `/api/workspace/members` | 401 | OK_PROTECTED | 231 |
