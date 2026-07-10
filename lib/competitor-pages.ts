import { PLANS, freePlanQrMarketingLabel } from './plans';

const FREE_QR = PLANS.free.maxQrCodes;
const FREE_QR_LABEL = freePlanQrMarketingLabel();

export interface CompetitorPage {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  headline: string;
  summary: string;
  qrbannerWins: string[];
  competitorWeaknesses: string[];
  comparisonRows: { feature: string; qrbanner: string; competitor: string }[];
}

export const COMPETITOR_PAGES: CompetitorPage[] = [
  {
    slug: 'qr-tiger',
    name: 'QR TIGER',
    title: 'QRbanner vs QR TIGER',
    metaDescription:
      'Compare QRbanner and QR TIGER: pricing, free plan limits, API access, codes after cancel and analytics. See which QR platform fits your team.',
    headline: 'QRbanner vs QR TIGER — Honest Comparison',
    summary:
      'QR TIGER is a popular all-round QR platform. QRbanner competes on generous free limits, API on free tier, and codes that stay active after cancel.',
    qrbannerWins: [
      '${FREE_QR} free dynamic QR codes vs 3 on QR TIGER',
      'REST API included on free plan',
      'Codes stay active after downgrade or cancel',
      'Pro from $9.99/mo',
      'Print banner export built in',
    ],
    competitorWeaknesses: [
      'Free tier limited to 3 dynamic codes',
      '500 scan cap on free tier (reported)',
      'API typically on paid plans',
    ],
    comparisonRows: [
      { feature: 'Free dynamic QR codes', qrbanner: '25', competitor: '3' },
      { feature: 'Codes active after cancel', qrbanner: 'Yes', competitor: 'Yes' },
      { feature: 'REST API (free plan)', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Geofence + schedule routing', qrbanner: 'Included', competitor: 'Paid tiers' },
      { feature: 'Starting paid price', qrbanner: '$9.99/mo', competitor: '~$7/mo' },
      { feature: 'Print banner export', qrbanner: 'Yes', competitor: 'Limited' },
    ],
  },
  {
    slug: 'flowcode',
    name: 'Flowcode',
    title: 'QRbanner vs Flowcode',
    metaDescription:
      'QRbanner vs Flowcode comparison for marketing teams. Features, pricing, analytics and design tools compared side by side.',
    headline: 'QRbanner vs Flowcode — Which Fits Your Budget?',
    summary:
      'Flowcode excels at premium visual design for US marketing teams. QRbanner offers broader routing, API access and a much lower entry price.',
    qrbannerWins: [
      'Full routing stack (geo, schedule, A/B) on standard plans',
      'Free API and webhooks',
      'Pro at $9.99/mo vs Flowcode paid tiers often $25+/mo',
      '27 QR types including Link Hub',
      'GPS heatmap and lead capture',
    ],
    competitorWeaknesses: [
      'Premium design focus comes with higher pricing',
      'Many features gated behind upper tiers',
      '0 free dynamic codes on some tiers',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: '0–2' },
      { feature: 'Entry paid plan', qrbanner: '$9.99/mo', competitor: '$25+/mo' },
      { feature: 'A/B testing', qrbanner: 'Included', competitor: 'Higher tiers' },
      { feature: 'API access', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Design templates', qrbanner: 'Good', competitor: 'Excellent' },
    ],
  },
  {
    slug: 'uniqode',
    name: 'Uniqode (Beaconstac)',
    title: 'QRbanner vs Uniqode',
    metaDescription:
      'Compare QRbanner with Uniqode (Beaconstac) for SMB and enterprise QR needs. Pricing, compliance and feature depth.',
    headline: 'QRbanner vs Uniqode — SMB vs Enterprise',
    summary:
      'Uniqode targets enterprise with compliance and deep integrations. QRbanner delivers 70% of the feature set at a fraction of the cost for growth teams.',
    qrbannerWins: [
      'Pro $9.99/mo vs Uniqode Core ~$49/mo',
      `${FREE_QR} free dynamic codes`,
      'Team workspaces on all plans',
      'Custom scan domains on free tier',
    ],
    competitorWeaknesses: [
      'Higher starting price for core features',
      'SSO and audit log on enterprise tiers',
      'No meaningful free tier',
    ],
    comparisonRows: [
      { feature: 'Free plan', qrbanner: '25 QR codes', competitor: 'Limited/none' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$49/mo' },
      { feature: 'Custom domain', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'SOC 2 / HIPAA', qrbanner: 'Roadmap', competitor: 'Enterprise' },
      { feature: 'CRM integrations', qrbanner: 'Webhooks/API', competitor: 'Native' },
    ],
  },
  {
    slug: 'qr-code-monkey',
    name: 'QR Code Monkey',
    title: 'QRbanner vs QR Code Monkey',
    metaDescription:
      'QR Code Monkey vs QRbanner: static vs dynamic QR, analytics, API and pricing compared for businesses that need editable codes.',
    headline: 'QRbanner vs QR Code Monkey',
    summary:
      'QR Code Monkey is excellent for free static QR design. QRbanner is a full dynamic platform with analytics, routing and team tools.',
    qrbannerWins: [
      'True dynamic QR with analytics',
      'Editable destinations without reprint',
      'Geofence, schedule and A/B routing',
      'Dashboard, API and webhooks',
    ],
    competitorWeaknesses: [
      'Dynamic features require separate paid platform',
      'Limited analytics on free static codes',
    ],
    comparisonRows: [
      { feature: 'Dynamic QR + analytics', qrbanner: 'Core product', competitor: 'Paid platform' },
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Via upgrade' },
      { feature: 'Static design (free)', qrbanner: 'Yes', competitor: 'Excellent' },
      { feature: 'API', qrbanner: 'Free plan', competitor: 'Paid' },
    ],
  },
  {
    slug: 'bitly',
    name: 'Bitly',
    title: 'QRbanner vs Bitly QR',
    metaDescription:
      'QRbanner vs Bitly for QR codes and short links. Compare QR-native features, analytics depth and pricing.',
    headline: 'QRbanner vs Bitly — QR-Native vs Link Tool',
    summary:
      'Bitly is a link management leader with QR as an add-on. QRbanner is built QR-first with deeper scan analytics and design tools.',
    qrbannerWins: [
      '27 QR-specific content types',
      'QR design editor with frames and logo',
      'Scan heatmaps and GPS analytics',
      'Landing pages and lead capture',
      'Print banner export',
    ],
    competitorWeaknesses: [
      'QR is secondary to link shortening',
      'QR features often require higher plans',
    ],
    comparisonRows: [
      { feature: 'QR-first platform', qrbanner: 'Yes', competitor: 'Add-on' },
      { feature: 'QR types', qrbanner: '27+', competitor: 'URL-focused' },
      { feature: 'Scan geo analytics', qrbanner: 'Yes', competitor: 'Basic' },
      { feature: 'Free dynamic QR', qrbanner: '25', competitor: 'Trial/limited' },
    ],
  },
  {
    slug: 'scanova',
    name: 'Scanova',
    title: 'QRbanner vs Scanova',
    metaDescription:
      'Compare QRbanner and Scanova for dynamic QR codes, pricing, API access, routing rules and analytics for marketing teams.',
    headline: 'QRbanner vs Scanova — Feature Comparison',
    summary:
      'Scanova is a design-forward dynamic QR platform. QRbanner competes with a generous free tier, API on free plan and built-in print banner export.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence + schedule routing included',
      'Print-ready banner export',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Free tier more limited for teams testing at scale',
      'API typically gated to paid plans',
      'Higher entry price for white-label features',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited trial' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'Paid' },
      { feature: 'Custom scan domain', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Included' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$15/mo' },
    ],
  },
  {
    slug: 'me-qr',
    name: 'ME-QR',
    title: 'QRbanner vs ME-QR',
    metaDescription:
      'Compare QRbanner and ME-QR for dynamic QR codes, analytics, API access and pricing for small business and agency teams.',
    headline: 'QRbanner vs ME-QR',
    summary:
      'ME-QR offers QR generation with branding options. QRbanner differentiates with routing rules, a generous free tier and API on the free plan.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'Geofence and schedule routing included',
      'REST API on free plan',
      'Print banner export',
      'Campaign batches for multi-location rollouts',
    ],
    competitorWeaknesses: [
      'Fewer advanced routing options on entry tiers',
      'API and webhooks often require upgrades',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Routing rules', qrbanner: 'Geofence + schedule', competitor: 'Basic' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'Paid' },
      { feature: 'Custom scan domain', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$12/mo' },
    ],
  },
  {
    slug: 'beaconstac',
    name: 'Beaconstac',
    title: 'QRbanner vs Beaconstac',
    metaDescription:
      'QRbanner vs Beaconstac (Uniqode) for enterprise QR, NFC and proximity marketing. Compare pricing, API and dynamic QR depth.',
    headline: 'QRbanner vs Beaconstac — QR-First vs Proximity Suite',
    summary:
      'Beaconstac (now Uniqode) targets enterprise proximity and NFC use cases. QRbanner is QR-native with faster self-serve onboarding and lower entry pricing.',
    qrbannerWins: [
      'Self-serve from free to Agency',
      'Pro from $9.99/mo',
      '27+ QR content types',
      'Built-in print banner export',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Higher starting price for full feature set',
      'QR can feel secondary to NFC/beacon stack',
      'Enterprise sales cycle for volume deals',
    ],
    comparisonRows: [
      { feature: 'Self-serve free plan', qrbanner: FREE_QR_LABEL, competitor: 'Trial-focused' },
      { feature: 'QR-native workflow', qrbanner: 'Core product', competitor: 'Part of suite' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$49/mo' },
      { feature: 'Geofence routing', qrbanner: 'Included', competitor: 'Included' },
      { feature: 'API + webhooks', qrbanner: 'Free tier', competitor: 'Higher tiers' },
    ],
  },
  {
    slug: 'unitag',
    name: 'Unitag',
    title: 'QRbanner vs Unitag',
    metaDescription:
      'Compare QRbanner and Unitag QR code generators for dynamic codes, design tools, analytics and team collaboration.',
    headline: 'QRbanner vs Unitag',
    summary:
      'Unitag is known for polished QR design. QRbanner adds deeper analytics, routing, API access and agency-scale tooling at competitive pricing.',
    qrbannerWins: [
      'Scan analytics with geo and export',
      'Smart routing (time, location, device)',
      'REST API on free plan',
      'Team workspaces and folders',
      'White-label on Agency plan',
    ],
    competitorWeaknesses: [
      'Dynamic analytics less central on free tools',
      'Team and API features on higher plans',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Geo scan analytics', qrbanner: 'Yes', competitor: 'Paid tiers' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Limited' },
      { feature: 'API access', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Agency white-label', qrbanner: 'Agency plan', competitor: 'Enterprise' },
    ],
  },
  {
    slug: 'hovercode',
    name: 'Hovercode',
    title: 'QRbanner vs Hovercode',
    metaDescription:
      'Compare QRbanner and Hovercode for dynamic QR codes, design tools, analytics depth and API access.',
    headline: 'QRbanner vs Hovercode',
    summary:
      'Hovercode focuses on beautiful QR design and simple dynamic links. QRbanner adds routing rules, API on free tier and agency-scale tooling.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'Geofence and schedule routing',
      'REST API on free plan',
      'Campaign batches and folders',
      'Print banner export',
    ],
    competitorWeaknesses: [
      'Limited routing on entry plans',
      'API and webhooks on higher tiers',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Basic' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'Paid' },
      { feature: 'Scan geo analytics', qrbanner: 'Yes', competitor: 'Varies' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$12/mo' },
    ],
  },
  {
    slug: 'qrcodechimp',
    name: 'QRCodeChimp',
    title: 'QRbanner vs QRCodeChimp',
    metaDescription:
      'QRbanner vs QRCodeChimp: dynamic QR limits, analytics, custom domains and pricing compared for growing teams.',
    headline: 'QRbanner vs QRCodeChimp',
    summary:
      'QRCodeChimp offers QR pages and marketing features. QRbanner competes with transparent pricing, codes that stay active after cancel and API on the free plan.',
    qrbannerWins: [
      'Codes stay active after cancel',
      'Free custom scan domain',
      '27+ QR content types',
      'Bulk CSV import',
      'White-label on Agency plan',
    ],
    competitorWeaknesses: [
      'Free tier scan and code limits',
      'API access typically paid',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
      { feature: 'Custom scan domain', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'API access', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$9.99/mo' },
    ],
  },
  {
    slug: 'qrfy',
    name: 'QRFY',
    title: 'QRbanner vs QRFY',
    metaDescription:
      'Compare QRbanner and QRFY for dynamic QR limits, analytics, API access, custom domains and pricing for growing teams.',
    headline: 'QRbanner vs QRFY',
    summary:
      'QRFY offers QR pages and marketing templates. QRbanner competes with more free dynamic codes, routing rules, API on the free tier and codes that stay active after cancel.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'Geofence and schedule routing',
      'REST API on free plan',
      'Custom scan domain on free tier',
      'Print banner export',
    ],
    competitorWeaknesses: [
      'Lower free dynamic code limits',
      'Advanced routing on paid tiers',
      'API typically requires upgrade',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Paid tiers' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$9.99/mo' },
    ],
  },
  {
    slug: 'adobe-express',
    name: 'Adobe Express',
    title: 'QRbanner vs Adobe Express QR',
    metaDescription:
      'QRbanner vs Adobe Express for dynamic QR codes: analytics, routing, API, team management and when design-only tools fall short.',
    headline: 'QRbanner vs Adobe Express QR',
    summary:
      'Adobe Express is excellent for creative assets and static QR export. QRbanner is built for teams that need dynamic destinations, scan analytics, routing and developer integrations.',
    qrbannerWins: [
      'Dynamic QR — change URL after print',
      'Scan analytics and geo insights',
      'Schedule and geofence routing',
      'REST API and webhooks',
      'Team workspaces and folders',
    ],
    competitorWeaknesses: [
      'QR export is typically static',
      'No scan analytics or routing engine',
      'Not built for multi-location QR ops',
    ],
    comparisonRows: [
      { feature: 'Dynamic QR (edit after print)', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Routing rules', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'REST API', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Best for', qrbanner: 'Ops & marketing teams', competitor: 'One-off design export' },
    ],
  },
  {
    slug: 'qrstuff',
    name: 'QR Stuff',
    title: 'QRbanner vs QR Stuff',
    metaDescription:
      'Compare QRbanner and QR Stuff for dynamic QR limits, analytics, API access, custom domains and team features.',
    headline: 'QRbanner vs QR Stuff',
    summary:
      'QR Stuff is a long-running QR generator with design tools. QRbanner focuses on dynamic operations — routing, analytics, API on the free tier and codes that stay active after cancel.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'Geofence and schedule routing',
      'REST API on free plan',
      'Custom scan domain on free tier',
      'Campaign batches and folders',
    ],
    competitorWeaknesses: [
      'Free tier code and scan limits',
      'Advanced routing on paid plans',
      'API access typically paid',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Paid tiers' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$12/mo' },
    ],
  },
  {
    slug: 'pageloot',
    name: 'Pageloot',
    title: 'QRbanner vs Pageloot',
    metaDescription:
      'QRbanner vs Pageloot for dynamic QR pages, analytics depth, developer API and pricing for marketing teams.',
    headline: 'QRbanner vs Pageloot',
    summary:
      'Pageloot offers QR landing pages and templates. QRbanner adds deeper routing, scan analytics, bulk tools and a generous free API for teams scaling beyond one-off pages.',
    qrbannerWins: [
      'Codes stay active after cancel',
      '27+ QR content types',
      'Bulk CSV import',
      'Webhooks on all plans',
      'White-label Agency plan',
    ],
    competitorWeaknesses: [
      'Limited free dynamic codes',
      'Routing and API on higher tiers',
      'Less built for multi-location ops',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'Basic' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$10/mo' },
    ],
  },
  {
    slug: 'visualead',
    name: 'Visualead',
    title: 'QRbanner vs Visualead',
    metaDescription:
      'Compare QRbanner and Visualead for dynamic QR limits, design tools, analytics, API access and pricing.',
    headline: 'QRbanner vs Visualead',
    summary:
      'Visualead emphasizes visual QR design and branded codes. QRbanner competes on operational scale — routing, analytics, API on the free tier and bulk multi-location tooling.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'Geofence and schedule routing',
      'REST API on free plan',
      'Bulk CSV and campaign batches',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Limited free dynamic operations',
      'Routing and API on paid tiers',
      'Less focus on multi-location analytics',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Paid' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$10/mo' },
    ],
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    title: 'QRbanner vs QR Code Generator',
    metaDescription:
      'QRbanner vs generic QR Code Generator sites: dynamic links, analytics, routing, API and why free static tools cost more long-term.',
    headline: 'QRbanner vs QR Code Generator',
    summary:
      'Many QR Code Generator sites output static images with no dashboard. QRbanner is a full platform — edit links after print, track scans, route by location and automate with API.',
    qrbannerWins: [
      'Dynamic QR — change destination after print',
      'Scan analytics and geo insights',
      `${FREE_QR} free dynamic codes with API`,
      'Custom scan domains',
      'Print banner export',
    ],
    competitorWeaknesses: [
      'Often static QR only',
      'No scan analytics or team dashboard',
      'No routing or webhook automation',
    ],
    comparisonRows: [
      { feature: 'Dynamic QR', qrbanner: 'Yes', competitor: 'Rarely' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Routing rules', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Best for', qrbanner: 'Ongoing campaigns', competitor: 'One-off static image' },
    ],
  },
  {
    slug: 'wix',
    name: 'Wix QR',
    title: 'QRbanner vs Wix QR Code',
    metaDescription:
      'QRbanner vs Wix QR: dynamic links, scan analytics, routing, API and when website-builder QR falls short for campaigns.',
    headline: 'QRbanner vs Wix QR Code',
    summary:
      'Wix offers QR generation for site owners. QRbanner is built for teams running ongoing QR operations — dynamic destinations, analytics, routing rules and developer API across many codes.',
    qrbannerWins: [
      'Dynamic QR at scale with routing',
      `${FREE_QR} free dynamic codes + API`,
      'Scan analytics and webhooks',
      'Bulk CSV and campaign batches',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'QR tied to Wix site workflow',
      'Limited multi-location QR ops',
      'No dedicated routing engine',
    ],
    comparisonRows: [
      { feature: 'Dynamic QR (edit after print)', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'Basic' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Geofence routing', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Best for', qrbanner: 'QR-first teams', competitor: 'Wix site owners' },
    ],
  },
  {
    slug: 'scanova-alternative',
    name: 'Scanova Alternative',
    title: 'QRbanner as a Scanova Alternative',
    metaDescription:
      'Looking for a Scanova alternative? Compare QRbanner on free plan limits, API access, pricing, routing and codes that stay active after cancel.',
    headline: 'QRbanner — Scanova Alternative',
    summary:
      'Teams switch from Scanova to QRbanner for more free dynamic codes, API on the free tier, transparent pricing and print banner tooling built in.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Pro from $9.99/mo',
      'Print banner export',
      'White-label Agency plan',
    ],
    competitorWeaknesses: [
      'Higher entry pricing for some tiers',
      'API on paid plans',
      'Fewer free dynamic codes',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'Paid' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Paid tiers' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$15/mo' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
    ],
  },
  {
    slug: 'qrplanet',
    name: 'QR Planet',
    title: 'QRbanner vs QR Planet',
    metaDescription:
      'Compare QRbanner and QR Planet on dynamic QR limits, analytics, API, routing and pricing for growing marketing teams.',
    headline: 'QRbanner vs QR Planet',
    summary:
      'QR Planet offers QR pages and templates. QRbanner adds deeper routing, generous free API access, bulk tooling and codes that stay active after cancel.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Bulk CSV import',
      'Print banner export',
    ],
    competitorWeaknesses: [
      'Limited free dynamic codes',
      'API on paid tiers',
      'Less multi-location operations focus',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Paid' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$11/mo' },
    ],
  },
  {
    slug: 'delivr',
    name: 'Delivr',
    title: 'QRbanner vs Delivr',
    metaDescription:
      'QRbanner vs Delivr for dynamic QR, analytics depth, developer API, custom domains and enterprise-ready QR operations.',
    headline: 'QRbanner vs Delivr',
    summary:
      'Delivr targets marketing teams with QR pages and campaigns. QRbanner competes with transparent pricing, API on the free tier and operational tools for multi-location rollouts.',
    qrbannerWins: [
      'Codes stay active after cancel',
      'Custom scan domain on free plan',
      '27+ QR content types',
      'Webhooks on all plans',
      'White-label Agency plan',
    ],
    competitorWeaknesses: [
      'Higher tiers for advanced routing',
      'API typically paid',
      'Fewer free dynamic codes',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'Yes' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$14/mo' },
    ],
  },
  {
    slug: 'blinq',
    name: 'Blinq',
    title: 'QRbanner vs Blinq',
    metaDescription:
      'Compare QRbanner and Blinq for digital business cards, dynamic QR limits, analytics, API access and multi-location QR operations.',
    headline: 'QRbanner vs Blinq',
    summary:
      'Blinq focuses on digital business cards and contact sharing. QRbanner offers broader QR content types, REST API on the free tier and operational tools for menus, signage and multi-location rollouts.',
    qrbannerWins: [
      '27+ QR content types beyond vCards',
      'REST API on free plan',
      'Geofence and schedule routing',
      'Print banner export',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Primarily contact-card focused',
      'Limited free dynamic codes',
      'Less multi-location signage tooling',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Menu & PDF QR types', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Bulk CSV import', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$12/mo' },
    ],
  },
  {
    slug: 'kaywa',
    name: 'Kaywa',
    title: 'QRbanner vs Kaywa',
    metaDescription:
      'QRbanner vs Kaywa for dynamic QR codes, analytics, developer API, custom domains and modern QR operations at scale.',
    headline: 'QRbanner vs Kaywa',
    summary:
      'Kaywa is a long-standing QR generator brand. QRbanner competes with modern routing, transparent pricing, API on the free tier and tools built for marketing and operations teams.',
    qrbannerWins: [
      'Modern routing and A/B rules',
      'Webhooks on all plans',
      'Custom scan domain on free plan',
      'Bulk import and campaign batches',
      'White-label Agency plan',
    ],
    competitorWeaknesses: [
      'Legacy UX patterns',
      'API on paid tiers',
      'Fewer free dynamic codes',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Scan webhooks', qrbanner: 'All plans', competitor: 'Limited' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$13/mo' },
    ],
  },
  {
    slug: 'canva',
    name: 'Canva',
    title: 'QRbanner vs Canva',
    metaDescription:
      'Compare QRbanner and Canva QR tools for dynamic codes, scan analytics, API access, routing rules and multi-location QR operations.',
    headline: 'QRbanner vs Canva',
    summary:
      'Canva embeds QR in design workflows. QRbanner is built for dynamic QR operations — routing, webhooks, API, bulk import and codes that stay active after cancel.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Scan webhooks on all plans',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Design-tool QR is often static',
      'Limited scan analytics depth',
      'No developer API for QR ops',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'No' },
      { feature: 'Scan webhooks', qrbanner: 'All plans', competitor: 'No' },
      { feature: 'Bulk CSV import', qrbanner: 'Yes', competitor: 'No' },
    ],
  },
  {
    slug: 'godaddy',
    name: 'GoDaddy',
    title: 'QRbanner vs GoDaddy',
    metaDescription:
      'QRbanner vs GoDaddy QR generator for dynamic codes, analytics, developer API, custom domains and professional QR operations.',
    headline: 'QRbanner vs GoDaddy',
    summary:
      'GoDaddy offers basic QR alongside domains and websites. QRbanner competes with deeper analytics, API on the free tier and tools for marketing and operations teams.',
    qrbannerWins: [
      'Purpose-built dynamic QR platform',
      'Webhooks and REST API',
      '27+ QR content types',
      'Print banner export',
      'White-label Agency plan',
    ],
    competitorWeaknesses: [
      'Basic QR as add-on feature',
      'Limited routing and automation',
      'Fewer free dynamic codes',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'Basic' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$10/mo' },
    ],
  },
  {
    slug: 'linktree',
    name: 'Linktree',
    title: 'QRbanner vs Linktree',
    metaDescription:
      'Compare QRbanner and Linktree for dynamic QR codes, scan analytics, API access, routing rules and professional multi-location QR operations.',
    headline: 'QRbanner vs Linktree',
    summary:
      'Linktree focuses on link-in-bio pages. QRbanner offers full dynamic QR operations — 27+ content types, routing, webhooks, API and print-ready export for physical signage.',
    qrbannerWins: [
      '27+ QR content types beyond link pages',
      'REST API on free plan',
      'Geofence and schedule routing',
      'Print banner export',
      'Scan webhooks on all plans',
    ],
    competitorWeaknesses: [
      'Link-in-bio focus, not signage ops',
      'Limited print workflow tooling',
      'No bulk CSV import for QR codes',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Menu & PDF QR types', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
    ],
  },
  {
    slug: 'squarespace',
    name: 'Squarespace',
    title: 'QRbanner vs Squarespace',
    metaDescription:
      'QRbanner vs Squarespace QR tools for dynamic codes, analytics depth, developer API, custom domains and multi-location marketing rollouts.',
    headline: 'QRbanner vs Squarespace',
    summary:
      'Squarespace embeds basic QR in website builder workflows. QRbanner is purpose-built for dynamic QR at scale — routing, analytics, API and codes that stay active after cancel.',
    qrbannerWins: [
      'Purpose-built dynamic QR platform',
      'Webhooks and REST API',
      'Bulk import and campaign batches',
      'Custom scan domain on free plan',
      'White-label Agency plan',
    ],
    competitorWeaknesses: [
      'QR as website add-on',
      'Limited routing and automation',
      'Fewer free dynamic codes',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'Basic' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Geofence routing', qrbanner: 'Included', competitor: 'No' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$16/mo' },
    ],
  },
  {
    slug: 'rebrandly',
    name: 'Rebrandly',
    title: 'QRbanner vs Rebrandly',
    metaDescription:
      'Compare QRbanner and Rebrandly for dynamic QR codes, scan analytics, API access, routing rules and print-ready QR operations.',
    headline: 'QRbanner vs Rebrandly',
    summary:
      'Rebrandly focuses on branded short links. QRbanner offers full dynamic QR operations — 27+ content types, routing, webhooks, print export and codes that stay active after cancel.',
    qrbannerWins: [
      '27+ QR content types beyond short links',
      'REST API on free plan',
      'Print banner export',
      'Geofence and schedule routing',
      'Scan webhooks on all plans',
    ],
    competitorWeaknesses: [
      'Link branding focus, not signage ops',
      'Limited QR content type depth',
      'Fewer free dynamic codes',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Menu & PDF QR types', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
    ],
  },
  {
    slug: 'taplink',
    name: 'Taplink',
    title: 'QRbanner vs Taplink',
    metaDescription:
      'QRbanner vs Taplink for dynamic QR codes, analytics depth, developer API and multi-location marketing rollouts.',
    headline: 'QRbanner vs Taplink',
    summary:
      'Taplink offers link-in-bio pages for creators. QRbanner competes with operational QR tooling — routing, API, bulk import and analytics built for teams and signage.',
    qrbannerWins: [
      'Built for physical signage rollouts',
      'REST API on free plan',
      'Bulk CSV import',
      'Custom scan domain on free plan',
      'White-label Agency plan',
    ],
    competitorWeaknesses: [
      'Creator link-in-bio focus',
      'Limited multi-location ops tooling',
      'No bulk QR management',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Geofence routing', qrbanner: 'Included', competitor: 'No' },
      { feature: 'Print banner export', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$12/mo' },
    ],
  },
  {
    slug: 'tinyurl',
    name: 'TinyURL',
    title: 'QRbanner vs TinyURL',
    metaDescription:
      'Compare QRbanner and TinyURL for dynamic QR codes, scan analytics, API access, routing rules and professional QR operations.',
    headline: 'QRbanner vs TinyURL',
    summary:
      'TinyURL is a classic URL shortener. QRbanner is built for dynamic QR at scale — analytics, routing, webhooks, API and print-ready export for marketing teams.',
    qrbannerWins: [
      'Purpose-built dynamic QR platform',
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Print banner export',
    ],
    competitorWeaknesses: [
      'Short-link focus, not QR operations',
      'Limited scan analytics depth',
      'No bulk QR management',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Scan webhooks', qrbanner: 'All plans', competitor: 'No' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
    ],
  },
  {
    slug: 'short-io',
    name: 'Short.io',
    title: 'QRbanner vs Short.io',
    metaDescription:
      'QRbanner vs Short.io for dynamic QR codes, analytics depth, developer API, custom domains and multi-location rollouts.',
    headline: 'QRbanner vs Short.io',
    summary:
      'Short.io offers branded short links and basic QR. QRbanner competes with deeper QR operations — routing, webhooks, 27+ content types and codes that stay active after cancel.',
    qrbannerWins: [
      '27+ QR content types',
      'Webhooks on all plans',
      'Bulk CSV import',
      'Custom scan domain on free plan',
      'White-label Agency plan',
    ],
    competitorWeaknesses: [
      'Link-shortener first positioning',
      'Limited routing and automation',
      'Fewer free dynamic codes',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Limited' },
      { feature: 'Print banner export', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$18/mo' },
    ],
  },
  {
    slug: 'cuttly',
    name: 'Cutt.ly',
    title: 'QRbanner vs Cutt.ly',
    metaDescription:
      'Compare QRbanner and Cutt.ly for dynamic QR codes, scan analytics, API access, routing rules and print-ready QR operations.',
    headline: 'QRbanner vs Cutt.ly',
    summary:
      'Cutt.ly offers URL shortening with basic QR. QRbanner is built for dynamic QR operations — routing, webhooks, API, bulk import and analytics for marketing teams.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Print banner export',
      'Scan webhooks on all plans',
    ],
    competitorWeaknesses: [
      'URL shortener first',
      'Limited QR operations tooling',
      'Fewer free dynamic codes',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'No' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
    ],
  },
  {
    slug: 'onelink',
    name: 'OneLink',
    title: 'QRbanner vs OneLink',
    metaDescription:
      'QRbanner vs OneLink for dynamic QR codes, analytics depth, developer API and multi-location signage rollouts.',
    headline: 'QRbanner vs OneLink',
    summary:
      'OneLink targets creators with link-in-bio pages. QRbanner competes with operational QR tooling — 27+ content types, API on the free tier and print-ready export.',
    qrbannerWins: [
      '27+ QR content types',
      'Built for physical signage',
      'Bulk CSV import',
      'Custom scan domain on free plan',
      'White-label Agency plan',
    ],
    competitorWeaknesses: [
      'Link-in-bio focus',
      'Limited menu and PDF QR types',
      'No bulk QR management',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Menu & PDF QR types', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Print banner export', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$10/mo' },
    ],
  },
  {
    slug: 'sniply',
    name: 'Sniply',
    title: 'QRbanner vs Sniply',
    metaDescription:
      'Compare QRbanner and Sniply for dynamic QR codes, scan analytics, API access, routing rules and print-ready QR operations.',
    headline: 'QRbanner vs Sniply',
    summary:
      'Sniply adds CTAs to shared links. QRbanner is purpose-built for dynamic QR — analytics, routing, webhooks, API and print export for physical signage.',
    qrbannerWins: [
      'Purpose-built dynamic QR platform',
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Print banner export',
    ],
    competitorWeaknesses: [
      'Link overlay focus, not QR ops',
      'Limited signage workflow tooling',
      'Fewer free dynamic codes',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Scan webhooks', qrbanner: 'All plans', competitor: 'No' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
    ],
  },
  {
    slug: 'blink',
    name: 'BL.INK',
    title: 'QRbanner vs BL.INK',
    metaDescription:
      'QRbanner vs BL.INK for dynamic QR codes, analytics depth, developer API, custom domains and enterprise QR operations.',
    headline: 'QRbanner vs BL.INK',
    summary:
      'BL.INK offers enterprise link management. QRbanner competes with transparent pricing, API on the free tier and tools built for marketing and multi-location rollouts.',
    qrbannerWins: [
      `Free plan with ${FREE_QR_LABEL}`,
      'REST API on free plan',
      '27+ QR content types',
      'Print banner export',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Enterprise link platform pricing',
      'QR as secondary feature',
      'Limited free tier',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Paid' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'Limited' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$48/mo' },
    ],
  },
  {
    slug: 'segno',
    name: 'Segno',
    title: 'QRbanner vs Segno',
    metaDescription:
      'Compare QRbanner and Segno for dynamic QR codes, scan analytics, API access, routing rules and print-ready QR operations.',
    headline: 'QRbanner vs Segno',
    summary:
      'Segno offers design-forward QR pages. QRbanner competes with deeper operations tooling — routing, webhooks, API on the free tier and bulk import for multi-location teams.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Bulk CSV import',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Design-first, less ops focus',
      'Limited free dynamic codes',
      'API on paid tiers',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Scan webhooks', qrbanner: 'All plans', competitor: 'Limited' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
    ],
  },
  {
    slug: 'goqr',
    name: 'GoQR',
    title: 'QRbanner vs GoQR',
    metaDescription:
      'QRbanner vs GoQR for dynamic QR codes, analytics depth, developer API and professional QR operations at scale.',
    headline: 'QRbanner vs GoQR',
    summary:
      'GoQR is a basic QR generator. QRbanner offers dynamic codes with analytics, routing, API, webhooks and print export built for growing teams.',
    qrbannerWins: [
      'Dynamic codes with analytics',
      'REST API on free plan',
      '27+ QR content types',
      'Print banner export',
      'White-label Agency plan',
    ],
    competitorWeaknesses: [
      'Static generator focus',
      'No developer API',
      'Limited team features',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'Basic' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'No' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: 'Free/static' },
    ],
  },
  {
    slug: 'qrzebra',
    name: 'QR Zebra',
    title: 'QRbanner vs QR Zebra',
    metaDescription:
      'Compare QRbanner and QR Zebra for dynamic QR codes, scan analytics, API access, routing rules and team operations at scale.',
    headline: 'QRbanner vs QR Zebra',
    summary:
      'QR Zebra offers QR generation with basic analytics. QRbanner adds routing rules, webhooks, REST API on the free tier and bulk import for multi-location teams.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Bulk CSV import',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Limited routing automation',
      'API on paid tiers',
      'Less ops tooling for teams',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Limited' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
    ],
  },
  {
    slug: 'uqr',
    name: 'UQR',
    title: 'QRbanner vs UQR',
    metaDescription:
      'QRbanner vs UQR for dynamic QR codes, analytics depth, developer API and professional QR operations for marketing teams.',
    headline: 'QRbanner vs UQR',
    summary:
      'UQR focuses on simple QR page creation. QRbanner offers deeper scan analytics, routing, API, webhooks and print export for growing operations teams.',
    qrbannerWins: [
      'Dynamic codes with analytics',
      'REST API on free plan',
      '27+ QR content types',
      'Print banner export',
      'Team workspaces',
    ],
    competitorWeaknesses: [
      'Basic page builder focus',
      'Limited developer API',
      'Fewer routing options',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'Basic' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Limited' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'No' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$15/mo' },
    ],
  },
  {
    slug: 'myqrcode',
    name: 'MyQRCode',
    title: 'QRbanner vs MyQRCode',
    metaDescription:
      'Compare QRbanner and MyQRCode for dynamic QR codes, scan analytics, API access, routing rules and team operations.',
    headline: 'QRbanner vs MyQRCode',
    summary:
      'MyQRCode offers QR page creation with basic tracking. QRbanner adds routing rules, webhooks, REST API on the free tier and bulk import for growing teams.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Bulk CSV import',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Limited routing automation',
      'API on paid tiers',
      'Fewer ops features for teams',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Limited' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
    ],
  },
  {
    slug: 'qrcodecreator',
    name: 'QRCodeCreator',
    title: 'QRbanner vs QRCodeCreator',
    metaDescription:
      'QRbanner vs QRCodeCreator for dynamic QR codes, analytics depth, developer API and professional QR operations at scale.',
    headline: 'QRbanner vs QRCodeCreator',
    summary:
      'QRCodeCreator focuses on simple QR generation. QRbanner offers dynamic codes with analytics, routing, API, webhooks and print export for operations teams.',
    qrbannerWins: [
      'Dynamic codes with analytics',
      'REST API on free plan',
      '27+ QR content types',
      'Print banner export',
      'Team workspaces',
    ],
    competitorWeaknesses: [
      'Generator-first workflow',
      'Limited developer API',
      'Basic team features',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'Basic' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'No' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$12/mo' },
    ],
  },
  {
    slug: 'qrcodekit',
    name: 'QRCodeKit',
    title: 'QRbanner vs QRCodeKit',
    metaDescription:
      'Compare QRbanner and QRCodeKit for dynamic QR codes, scan analytics, API access, routing rules and team operations.',
    headline: 'QRbanner vs QRCodeKit',
    summary:
      'QRCodeKit offers branded QR pages with basic analytics. QRbanner adds routing rules, webhooks, REST API on the free tier and bulk import for multi-location teams.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Bulk CSV import',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Limited routing automation',
      'API on paid tiers',
      'Less ops tooling for teams',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Paid' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Limited' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Active after cancel', qrbanner: 'Yes', competitor: 'Varies' },
    ],
  },
  {
    slug: 'qrdynamic',
    name: 'QR Dynamic',
    title: 'QRbanner vs QR Dynamic',
    metaDescription:
      'QRbanner vs QR Dynamic for dynamic QR codes, analytics depth, developer API and professional QR operations at scale.',
    headline: 'QRbanner vs QR Dynamic',
    summary:
      'QR Dynamic focuses on editable QR links. QRbanner offers deeper scan analytics, routing, API, webhooks and print export for growing operations teams.',
    qrbannerWins: [
      'Dynamic codes with analytics',
      'REST API on free plan',
      '27+ QR content types',
      'Print banner export',
      'Team workspaces',
    ],
    competitorWeaknesses: [
      'Link-editor focus',
      'Limited developer API',
      'Basic team features',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'Basic' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Limited' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'No' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$14/mo' },
    ],
  },
  {
    slug: 'scantrust',
    name: 'ScanTrust',
    title: 'QRbanner vs ScanTrust',
    metaDescription:
      'Compare QRbanner and ScanTrust for dynamic QR codes, anti-counterfeit features, analytics, API access and pricing for product packaging teams.',
    headline: 'QRbanner vs ScanTrust',
    summary:
      'ScanTrust focuses on product authentication and supply-chain traceability. QRbanner offers broader marketing QR tooling, generous free limits, API on the free tier and print banner export.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Print banner export built in',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Enterprise authentication focus',
      'Higher entry pricing for marketing use',
      'Less self-serve for SMB campaigns',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Marketing QR tooling', qrbanner: 'Full stack', competitor: 'Product focus' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'Enterprise' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Limited' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: 'Custom' },
    ],
  },
  {
    slug: 'scanqr',
    name: 'ScanQR',
    title: 'QRbanner vs ScanQR',
    metaDescription:
      'Compare QRbanner and ScanQR on dynamic QR limits, scan analytics, API access, routing rules and pricing for growing teams.',
    headline: 'QRbanner vs ScanQR',
    summary:
      'ScanQR offers quick QR generation for basic links. QRbanner adds deeper analytics, routing automation, API on the free tier and bulk import for multi-location operations.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Bulk CSV import',
      'Print banner export',
    ],
    competitorWeaknesses: [
      'Generator-first workflow',
      'Limited routing automation',
      'API on paid tiers',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'No' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$10/mo' },
    ],
  },
  {
    slug: 'create-qr-code',
    name: 'Create QR Code',
    title: 'QRbanner vs Create QR Code',
    metaDescription:
      'QRbanner vs Create QR Code for dynamic QR codes, analytics depth, developer API and professional QR operations at scale.',
    headline: 'QRbanner vs Create QR Code',
    summary:
      'Create QR Code tools target one-off static and basic dynamic codes. QRbanner offers scan analytics, routing, webhooks, API and team workspaces for ongoing campaigns.',
    qrbannerWins: [
      'Dynamic codes with analytics',
      'REST API on free plan',
      '27+ QR content types',
      'Team workspaces',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Basic generator workflow',
      'Limited developer API',
      'No multi-location ops tooling',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Very limited' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'Basic' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'No' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'No' },
      { feature: 'Team features', qrbanner: 'Yes', competitor: 'No' },
    ],
  },
  {
    slug: 'qrcode-online',
    name: 'QRCode Online',
    title: 'QRbanner vs QRCode Online',
    metaDescription:
      'Compare QRbanner and QRCode Online for dynamic QR codes, scan analytics, API access, routing and pricing for marketing teams.',
    headline: 'QRbanner vs QRCode Online',
    summary:
      'QRCode Online provides web-based QR generation. QRbanner adds routing rules, webhooks, REST API on the free tier and bulk tooling for growing operations.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Bulk CSV import',
      'Print banner export',
    ],
    competitorWeaknesses: [
      'Web generator focus',
      'Limited routing automation',
      'API on paid tiers',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'No' },
      { feature: 'Bulk import', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$12/mo' },
    ],
  },
  {
    slug: 'qr-code-ai',
    name: 'QR Code AI',
    title: 'QRbanner vs QR Code AI',
    metaDescription:
      'QRbanner vs QR Code AI for dynamic QR codes, AI-assisted design, analytics, API access and team operations compared side by side.',
    headline: 'QRbanner vs QR Code AI',
    summary:
      'QR Code AI emphasizes AI-generated QR art and quick creation. QRbanner competes on routing depth, API on the free tier, bulk import and codes that stay active after cancel.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Bulk CSV import',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'AI design focus over ops tooling',
      'Limited routing automation',
      'API on paid tiers',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'No' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'No' },
      { feature: 'AI QR art', qrbanner: 'Logo + color', competitor: 'Strong' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$15/mo' },
    ],
  },
  {
    slug: 'qrcode-pro',
    name: 'QRCode Pro',
    title: 'QRbanner vs QRCode Pro',
    metaDescription:
      'Compare QRbanner and QRCode Pro on dynamic QR limits, analytics, API access, routing rules and pricing for professional QR campaigns.',
    headline: 'QRbanner vs QRCode Pro',
    summary:
      'QRCode Pro targets professionals with branded QR pages. QRbanner offers more free dynamic codes, API on the free tier, routing automation and print banner export.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Print banner export',
      'White-label Agency plan',
    ],
    competitorWeaknesses: [
      'Fewer free dynamic codes',
      'API on paid tiers',
      'Less bulk ops tooling',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'REST API (free)', qrbanner: 'Yes', competitor: 'Paid' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'Paid tiers' },
      { feature: 'Print export', qrbanner: 'Banner built in', competitor: 'PNG/SVG' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$13/mo' },
    ],
  },
  {
    slug: 'dynamic-qr-code',
    name: 'Dynamic QR Code',
    title: 'QRbanner vs Dynamic QR Code',
    metaDescription:
      'QRbanner vs Dynamic QR Code generators for editable links, scan analytics, developer API, routing rules and team operations at scale.',
    headline: 'QRbanner vs Dynamic QR Code',
    summary:
      'Generic dynamic QR code tools focus on editable destinations. QRbanner adds scan analytics, routing, webhooks, API on the free tier and bulk import for multi-location teams.',
    qrbannerWins: [
      `${FREE_QR} free dynamic QR codes`,
      'REST API on free plan',
      'Geofence and schedule routing',
      'Bulk CSV import',
      'Codes stay active after cancel',
    ],
    competitorWeaknesses: [
      'Link-editor focus',
      'Limited developer API',
      'Basic team features',
    ],
    comparisonRows: [
      { feature: 'Free dynamic codes', qrbanner: '25', competitor: 'Limited' },
      { feature: 'Scan analytics', qrbanner: 'Yes', competitor: 'Basic' },
      { feature: 'REST API', qrbanner: 'Free plan', competitor: 'Limited' },
      { feature: 'Routing rules', qrbanner: 'Included', competitor: 'No' },
      { feature: 'Starting paid', qrbanner: '$9.99/mo', competitor: '~$11/mo' },
    ],
  },
];

export function getCompetitorBySlug(slug: string): CompetitorPage | undefined {
  return COMPETITOR_PAGES.find((p) => p.slug === slug);
}
