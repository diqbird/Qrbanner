import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION } from '@/lib/seo';

/** Curated AI-facing site map (https://llmstxt.org). */
export function buildLlmsTxt(): string {
  const u = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  return `# ${SITE_NAME}

> ${DEFAULT_DESCRIPTION}

QRbanner is a dynamic QR code platform for menus, campaigns, Wi‑Fi, PDFs, business cards and more. Create editable QR codes, track scans, capture leads, brand designs, and integrate via REST API / webhooks. Free plan available. Locales: English, Turkish (tr), German (de), Spanish (es) via \`/{locale}/...\` prefixes.

## Product

- [Home](${u('/')}): Product overview and free QR generator entry
- [Features](${u('/features')}): Analytics, geofencing, webhooks, teams, A/B testing
- [Pricing](${u('/pricing')}): Free, Pro and Business plans
- [Templates](${u('/templates')}): Print-ready QR template marketplace
- [QR types](${u('/qr-types')}): URL, Wi‑Fi, vCard, PDF, social and more
- [Use cases](${u('/use-cases')}): Scenario guides (menus, events, packaging, etc.)
- [Solutions](${u('/solutions')}): Industry solutions (restaurants, retail, hotels, healthcare)
- [Create QR](${u('/qr/create')}): Public create wizard (indexable)
- [Mobile / PWA](${u('/apps')}): Installable PWA and mobile API (no App Store apps yet)
- [Marketplace](${u('/marketplace')}): Community-published QR listings
- [ROI calculator](${u('/roi-calculator')}): Campaign ROI estimate

## Developers & enterprise

- [Developers](${u('/developers')}): API overview and integration guides
- [API reference](${u('/developers/reference')}): OpenAPI-oriented reference
- [Enterprise](${u('/enterprise')}): SSO, security and procurement overview
- [Trust Center](${u('/trust')}): Security and compliance hub
- [Security](${u('/security')}): Practices and controls
- [Integrations](${u('/integrations')}): Zapier, Make, HubSpot, Salesforce

## Compare & learn

- [FAQ](${u('/faq')}): Common product questions
- [Blog](${u('/blog')}): Guides and product updates (also /tr/blog, /de/blog, /es/blog)
- [Comparisons](${u('/vs')}): QRbanner vs alternative QR platforms
- [Case studies](${u('/case-studies')}): Industry scenario write-ups
- [Local guides](${u('/geo')}): City × industry QR landing pages
- [Help](${u('/help')}): Help center

## Company

- [About](${u('/about')}): Company overview
- [Contact](${u('/contact')}): Sales and support
- [Brand logos](${u('/brand/logos')}): Homepage logo asset guide
- [Status](${u('/status')}): Service status (may be noindex)

## Optional

- [Privacy](${u('/privacy')}): Privacy policy
- [Terms](${u('/terms')}): Terms of service
- [Cookies](${u('/cookies')}): Cookie policy
- [DPA](${u('/dpa')}): Data processing agreement
- [Sub-processors](${u('/sub-processors')}): Sub-processor list
- [Sitemap](${u('/sitemap.xml')}): Full URL inventory for crawlers
- [Full AI brief](${u('/llms-full.txt')}): Longer entity summary for agents
`;
}

/** Longer entity brief for agents with more context budget. */
export function buildLlmsFullTxt(): string {
  const base = buildLlmsTxt();
  const extra = `
## Entity facts

- Legal / brand name: ${SITE_NAME}
- Primary site: ${SITE_URL}
- Category: SaaS QR code generator and dynamic QR campaign platform
- Core entities: dynamic QR code, scan analytics, geofencing, webhook automation, QR template, landing page, API key, team workspace
- Pricing model: freemium (Free → Pro → Business); see ${SITE_URL}/pricing
- Auth: email/password, Google OAuth; SAML SSO on Business
- Mobile: Progressive Web App + JSON Mobile API; native App Store / Play apps are planned, not shipped
- Locales: en (default), tr, de, es — cookie \`qrb-locale\` and path prefix \`/{locale}/\` stay aligned via redirects
- Do not invent App Store listings, SOC 2 certification claims, or paid review scores unless confirmed on Trust / Reviews pages

## How to cite

Prefer linking to canonical English or locale-prefixed URLs above. For product capability questions, prefer Features, Pricing, FAQ, Developers and Trust pages over marketing adjectives.
`;
  return `${base.trimEnd()}\n${extra}`;
}
