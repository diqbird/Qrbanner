# SOC 2 readiness & evidence map

**Status:** In progress — **not certified**.  
This document is an internal/public honesty map of shipped controls vs SOC 2 Trust Services Criteria. It is **not** a SOC 2 Type I/II report and must not be presented as one.

Last updated: July 2026 · Product: [QRbanner](https://qrbanner.com)

---

## How to use this

1. Enterprise buyers: start with [/trust](https://qrbanner.com/trust) and [/trust/procurement-request](https://qrbanner.com/trust/procurement-request).
2. Ask for questionnaire / DPA / BAA via procurement — we do **not** self-serve SOC 2 PDF downloads.
3. Engineering: map each row below to code evidence before audits.

---

## Trust Services Criteria — rough mapping

| Area | Shipped today | Evidence / where to look |
|------|----------------|---------------------------|
| **Security — access** | TOTP MFA + recovery codes; MFA step-up for secrets (API keys, webhooks, SCIM, SMTP, team changes, password) | `/security`, Settings MFA, `lib/mfa-recovery.ts` |
| **Security — credentials** | bcrypt passwords; API keys hashed; optional IP allowlists | `/security`, API key settings |
| **Security — transport** | HTTPS for app, scans, API | `/security` infra section |
| **Security — integrations** | HMAC-SHA256 scan webhooks; rotatable secrets; delivery history | Settings → Webhooks, `/developers` |
| **Availability** | Public status + 99.9% monthly target (enterprise) | `/status` — **not** a SOC 2 report |
| **Confidentiality** | Per-QR passwords; plan retention; export/delete; account delete | Dashboard + Settings |
| **Privacy / GDPR-oriented** | Privacy policy, DPA, sub-processors | `/privacy`, `/dpa`, `/sub-processors` |
| **Billing / PCI** | Paddle as Merchant of Record (subscriptions + marketplace checkout) | `/security` infra; no card data on QRbanner |

---

## Roadmap (honest)

1. Gap assessment against TSC (security, availability, confidentiality).
2. Remediate: access reviews, change management, vendor risk, centralized logging.
3. Independent auditor — Type I, then Type II observation window.
4. Report availability for qualified enterprises via procurement — **only after issuance**.

We will **not** claim “SOC 2 certified” until a report is issued.

---

## Related live pages

- [Security practices](https://qrbanner.com/security)
- [Trust Center](https://qrbanner.com/trust)
- [System status](https://qrbanner.com/status)
- [DPA](https://qrbanner.com/dpa)
- [Sub-processors](https://qrbanner.com/sub-processors)
- [Procurement request](https://qrbanner.com/trust/procurement-request)
