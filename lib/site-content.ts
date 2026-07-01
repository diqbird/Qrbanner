import type { LucideIcon } from 'lucide-react';
import {
  QrCode,
  Palette,
  BarChart3,
  Globe,
  Smartphone,
  Download,
  Layers,
  RefreshCw,
  Image as ImageIcon,
  Zap,
  MapPin,
  Clock,
  Shield,
  FileSpreadsheet,
  Code2,
  Link2,
  Megaphone,
  Bell,
  FolderOpen,
  Printer,
  Route,
  Webhook,
  UserPlus,
  Bookmark,
  Users,
  Split,
  Nfc,
  Sparkles,
  MousePointerClick,
  ShieldCheck,
  FileJson,
} from 'lucide-react';
import { PLANS } from '@/lib/plans';

export interface SiteFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  tag?: string;
}

export const HERO_HIGHLIGHTS = [
  { icon: QrCode, label: '26+ QR Types', desc: 'Menus, Wi‑Fi, business cards, social links & more' },
  { icon: Route, label: 'Smart Routing', desc: 'Show the right link by time, location or device' },
  { icon: BarChart3, label: 'Scan Analytics', desc: 'See who scans, when and where — then improve results' },
];

export const FEATURE_GROUPS: { title: string; description: string; features: SiteFeature[] }[] = [
  {
    title: 'Create & Design',
    description: 'Branded QR codes ready for print and digital.',
    features: [
      {
        icon: QrCode,
        title: 'Editable QR Codes',
        description: 'Change where your QR points anytime — no need to reprint menus, posters or packaging.',
      },
      {
        icon: Palette,
        title: 'Brand Your QR Code',
        description: 'Custom colors, dot styles, frames and logos so your codes match your brand on every touchpoint.',
      },
      {
        icon: ImageIcon,
        title: 'Logo in the Center',
        description: 'Add your logo with smart sizing so codes stay easy to scan on print and packaging.',
      },
      {
        icon: Layers,
        title: '26+ QR Types',
        description: 'Website, business card, Wi‑Fi, menu, WhatsApp, Instagram, PDF, events, payments and more — all in one place.',
      },
      {
        icon: Printer,
        title: 'Print Banner Export',
        description: 'Download ready-to-print marketing posters with your QR, headline and brand colors (PNG/PDF).',
        tag: 'Differentiator',
      },
      {
        icon: Sparkles,
        title: 'Design Assistant',
        description: 'Get color and style suggestions matched to your QR type — optimized for easy scanning.',
        tag: 'New',
      },
      {
        icon: Zap,
        title: 'Scan Reliability Check',
        description: 'See how scannable your design is before you print — contrast, size and camera preview.',
        tag: 'Differentiator',
      },
      {
        icon: Sparkles,
        title: 'AI Landing Copy',
        description: 'Generate titles, subtitles, CTA labels and SEO metadata in the landing page editor with one click.',
        tag: 'New',
      },
    ],
  },
  {
    title: 'Smart Routing',
    description: 'Send scanners to the right place automatically.',
    features: [
      {
        icon: Clock,
        title: 'Schedule by Time',
        description: 'Show lunch menus at noon and evening menus at night — automatically.',
      },
      {
        icon: MapPin,
        title: 'Location-Based Links',
        description: 'Send visitors in different countries or cities to the right page.',
      },
      {
        icon: Smartphone,
        title: 'Device Routing',
        description: 'Separate iOS and Android URLs for app-download and store campaigns.',
      },
      {
        icon: Megaphone,
        title: 'Landing Pages',
        description: 'Five mobile-friendly templates with optional lead capture forms before redirect — ideal for promos and events.',
      },
      {
        icon: Route,
        title: 'Split Testing (A/B)',
        description: 'Test two landing pages or offers and see which one gets more scans.',
        tag: 'Differentiator',
      },
      {
        icon: Link2,
        title: 'Campaign Tracking',
        description: 'Track which posters, flyers or ads drove the most scans in Google Analytics.',
      },
    ],
  },
  {
    title: 'Analytics & Marketing',
    description: 'Measure scans and connect to your ad stack.',
    features: [
      {
        icon: BarChart3,
        title: 'Real-Time Analytics',
        description: 'Total and unique scans, custom date ranges, device, browser, OS, country and city breakdowns.',
      },
      {
        icon: Globe,
        title: 'Geographic Insights',
        description: 'See where codes perform with country and city charts plus recent scan log.',
      },
      {
        icon: Zap,
        title: 'GA4 & Meta Pixel',
        description: 'Fire Google Analytics 4 and Facebook Pixel events on scan, landing page and CTA clicks.',
      },
      {
        icon: Bell,
        title: 'Scan Notifications',
        description: 'Email alerts on first scan, milestones (10, 50, 100…) or every scan if you choose.',
      },
      {
        icon: Download,
        title: 'CSV Export',
        description: 'Export analytics summaries from the dashboard and per-QR analytics pages.',
      },
      {
        icon: UserPlus,
        title: 'Lead Capture',
        description: 'Collect name, email, phone and message on landing pages. View submissions in per-QR analytics.',
        tag: 'Differentiator',
      },
      {
        icon: Webhook,
        title: 'Scan Webhooks',
        description: 'HTTP POST notifications on every scan with HMAC signatures — connect Zapier, Slack or your CRM.',
      },
      {
        icon: Nfc,
        title: 'NFC Tag Support',
        description: 'Program NFC tags with the same dynamic URL. Scans tracked separately as NFC in analytics.',
      },
      {
        icon: MapPin,
        title: 'GPS Heatmap',
        description: 'Optional browser geolocation on scan plus IP fallback — visualize scan clusters on a map.',
      },
      {
        icon: MousePointerClick,
        title: 'Landing CTA Analytics',
        description: 'Track button clicks on scan landing pages — measure conversion from scan to action.',
        tag: 'New',
      },
    ],
  },
  {
    title: 'Platform & Scale',
    description: 'Tools for teams, agencies and developers.',
    features: [
      {
        icon: FileSpreadsheet,
        title: 'Bulk CSV Import',
        description: 'Create up to 100 QR codes per import from a spreadsheet — stores, menus, events at scale.',
      },
      {
        icon: FolderOpen,
        title: 'Folders & Labels',
        description: 'Organize codes into colored folders and filter by custom labels on the dashboard.',
      },
      {
        icon: Code2,
        title: 'REST API v1',
        description: 'Manage QR codes and folders programmatically with API keys. Bearer or X-API-Key auth.',
      },
      {
        icon: Bookmark,
        title: 'Brand Style Templates',
        description: 'Save and reuse your QR dot styles, colors and frames across campaigns — your brand kit in one click.',
      },
      {
        icon: Globe,
        title: 'Custom Scan Domains',
        description: 'Verify your domain via DNS and serve scans from your brand URL (e.g. go.yourbrand.com).',
      },
      {
        icon: Users,
        title: 'Team Workspaces',
        description: 'Create team workspaces, invite members with roles (owner, admin, editor, viewer) and collaborate on QR codes.',
      },
      {
        icon: Shield,
        title: 'SSO & SAML',
        description: 'Sign in with Google or Microsoft Azure AD. Business workspaces can enforce SSO and configure SAML (Okta, Azure AD, etc.).',
      },
      {
        icon: Shield,
        title: 'Access Controls',
        description: 'Password-protected QRs, optional expiry dates and scan limits for gated campaigns.',
      },
      {
        icon: RefreshCw,
        title: 'Edit Anytime',
        description: 'Update content, style, routing rules and pixels without changing the printed QR image.',
      },
      {
        icon: ShieldCheck,
        title: 'Two-Factor Authentication',
        description: 'Protect your account with TOTP authenticator apps — Google Authenticator, 1Password and more.',
        tag: 'New',
      },
      {
        icon: FileJson,
        title: 'OpenAPI & Webhook Logs',
        description: 'Download the OpenAPI 3.0 spec for REST API v1 and inspect webhook delivery history in Settings.',
      },
    ],
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Pick Your Use Case',
    description: 'Choose a ready-made template or one of 26+ QR types — menus, business cards, Wi‑Fi, social links and more.',
  },
  {
    step: '02',
    title: 'Customize & Brand',
    description: 'Add your content, colors and logo. Set optional rules for time, location or device.',
  },
  {
    step: '03',
    title: 'Print or Share',
    description: 'Download PNG or SVG, print-ready posters, or share your short link anywhere.',
  },
  {
    step: '04',
    title: 'Track & Improve',
    description: 'Watch scans in real time, export reports, capture leads and optimize what works.',
  },
];

export const PRICING_PLANS = Object.values(PLANS).map((plan) => ({
  ...plan,
  features: [
    `${plan.maxQrCodes.toLocaleString()} dynamic QR codes`,
    `${plan.maxCustomDomains} custom scan domain${plan.maxCustomDomains === 1 ? '' : 's'}`,
    `Bulk import up to ${plan.maxBulkRows} rows`,
    plan.apiAccess ? 'REST API access' : 'No API access',
    plan.analyticsRetentionDays
      ? `${plan.analyticsRetentionDays}-day analytics history`
      : 'Unlimited analytics history',
    plan.codesActiveAfterCancel
      ? 'QR codes stay active if you cancel'
      : 'Codes pause when subscription ends',
    'Smart routing (schedule, geofence, device)',
    'GA4 & Meta Pixel support',
    'Scan webhooks & lead capture',
    'Brand style templates',
    'Folders, labels & scan notifications',
  ],
}));

export const COMPARISON_ROWS: { feature: string; qrbanner: string; typical: string }[] = [
  { feature: 'Dynamic QR codes', qrbanner: 'Included', typical: 'Included' },
  { feature: 'Codes active after cancel', qrbanner: 'Yes', typical: 'Often no' },
  { feature: 'Geofence + schedule routing', qrbanner: 'Included', typical: 'Paid tier' },
  { feature: 'Custom scan domain', qrbanner: 'Free plan', typical: 'Paid tier' },
  { feature: 'REST API', qrbanner: 'Free plan', typical: 'Paid tier' },
  { feature: 'Bulk CSV import', qrbanner: 'Included', typical: 'Paid tier' },
  { feature: 'Print banner export', qrbanner: 'Included', typical: 'Rare' },
  { feature: 'GA4 + Meta Pixel on scan', qrbanner: 'Included', typical: 'Partial' },
  { feature: 'Scan webhooks (Zapier-ready)', qrbanner: 'Included', typical: 'Paid tier' },
  { feature: 'Lead capture on landing pages', qrbanner: 'Included', typical: 'Paid tier' },
  { feature: 'Analytics date range filter', qrbanner: 'Included', typical: 'Paid tier' },
  { feature: 'Brand style templates', qrbanner: 'Included', typical: 'Rare' },
  { feature: 'A/B variant routing', qrbanner: 'Included', typical: 'Paid tier' },
  { feature: 'Team workspaces', qrbanner: 'Included', typical: 'Paid tier' },
  { feature: 'NFC tag tracking', qrbanner: 'Included', typical: 'Rare' },
  { feature: 'GPS scan heatmap', qrbanner: 'Included', typical: 'Paid tier' },
  { feature: 'SSO (Google / Microsoft)', qrbanner: 'Included', typical: 'Enterprise' },
  { feature: 'SAML SSO (Business)', qrbanner: 'Included', typical: 'Enterprise' },
  { feature: 'TOTP two-factor auth', qrbanner: 'Included', typical: 'Rare' },
  { feature: 'Landing CTA click analytics', qrbanner: 'Included', typical: 'Paid tier' },
  { feature: 'AI landing page copy', qrbanner: 'Pro+', typical: 'Rare' },
  { feature: 'OpenAPI specification', qrbanner: 'Included', typical: 'Rare' },
  { feature: 'Webhook delivery logs', qrbanner: 'Included', typical: 'Rare' },
];
