# HIPAA readiness & BAA discussion map

**Status:** In progress — **not HIPAA certified**.  
This document is an honesty map for enterprise healthcare buyers. It is **not** a HIPAA attestation, OCR audit result, or automatic BAA download.

Last updated: July 2026 · Product: [QRbanner](https://qrbanner.com)

---

## How to use this

1. Enterprise buyers: start with [/trust](https://qrbanner.com/trust) and request a **BAA discussion** via [/trust/procurement-request](https://qrbanner.com/trust/procurement-request).
2. Do **not** put PHI (Protected Health Information) in QR destinations, URL parameters, or landing copy — link to your existing HIPAA-capable patient portal / EHR forms instead.
3. BAAs are discussed for **qualified enterprise healthcare deals** only — not self-serve.

---

## Safeguards & product posture (honest)

| Area | Shipped today | Notes |
|------|----------------|-------|
| **Transport** | HTTPS for app, scans, API | Required baseline — not a BAA by itself |
| **Access** | MFA (TOTP + recovery); MFA step-up for secrets | Workspace-level controls |
| **Credentials** | bcrypt passwords; hashed API keys; optional IP allowlists | `/security` |
| **Confidentiality** | Per-QR passwords; retention by plan; export / account delete | Useful for ops — does not make QR URLs PHI-safe |
| **Privacy docs** | Privacy policy, DPA, sub-processors | GDPR-oriented; separate from HIPAA |
| **Procurement** | Security questionnaire + BAA discussion request form | Starts a conversation — not auto-signed BAA |
| **PHI in QR** | Product guidance: no PHI in QR payloads | Customer responsibility to use portal links |

---

## What we do **not** claim today

- HIPAA certification or “HIPAA compliant” marketing without a signed BAA and covered-entity scoping.
- Self-serve BAA PDF download.
- That QRbanner replaces a patient portal, EHR, or covered-entity compliance program.

---

## Roadmap (honest)

1. Qualify healthcare enterprise use cases and data flows (what touches QRbanner vs customer systems).
2. Legal/BAA template review for eligible deals.
3. Align technical safeguards and vendor list with agreement scope.
4. Countersign BAA via procurement — **only after commercial/legal approval**.

---

## Related live pages

- [SOC 2 readiness map](https://qrbanner.com/trust/soc2-readiness)
- [Trust Center](https://qrbanner.com/trust)
- [Security practices](https://qrbanner.com/security)
- [Procurement request](https://qrbanner.com/trust/procurement-request)
- [Privacy](https://qrbanner.com/privacy) · [DPA](https://qrbanner.com/dpa) · [Sub-processors](https://qrbanner.com/sub-processors)
