import type { Metadata } from 'next';
import { PLANS } from '@/lib/plans';
import { SUPPORT_EMAIL } from '@/lib/site-contact';

export const SITE_NAME = 'QRbanner';
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  'https://qrbanner.com'
).replace(/\/$/, '');

export const HOMEPAGE_FAQ_COUNT = 6;

export const DEFAULT_DESCRIPTION =
  'Create QR codes for menus, business cards, Wi‑Fi, Instagram, PDFs and more. Edit links anytime, track scans, capture leads and download print-ready designs. Free QR code generator with analytics — QRbanner.';

export const DEFAULT_KEYWORDS = [
  'QR code generator',
  'free QR code maker',
  'dynamic QR code',
  'restaurant menu QR code',
  'business card QR code',
  'WiFi QR code',
  'QR code analytics',
  'editable QR code',
  'Instagram QR code',
  'WhatsApp QR code',
  'QR code for events',
  'print QR code',
  'QR code tracking',
  'custom QR code design',
  'QR code software',
  'bulk QR code generator',
  'QR landing page',
  'QR code API',
];

const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — Dynamic QR Platform`,
};

export function absoluteUrl(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

/** hreflang alternates for public pages (en + tr share same URL; locale via cookie/UI) */
export function hreflangAlternates(path = '/'): Metadata['alternates'] {
  const url = absoluteUrl(path);
  return {
    canonical: url,
    languages: {
      en: url,
      tr: url,
      'x-default': url,
    },
  };
}

export const SOCIAL_PROFILE_URLS = [
  process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
  process.env.NEXT_PUBLIC_SOCIAL_TWITTER,
  process.env.NEXT_PUBLIC_SOCIAL_GITHUB,
].filter((u): u is string => Boolean(u?.trim()));

export function pageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  keywords = DEFAULT_KEYWORDS,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = path === '/' ? title : title;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: hreflangAlternates(path),
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: SITE_NAME,
      title: path === '/' ? `${SITE_NAME} — ${title}` : title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: path === '/' ? `${SITE_NAME} — ${title}` : title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export function getHomepageFaqItems() {
  return FAQ_ITEMS.slice(0, HOMEPAGE_FAQ_COUNT);
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/icon'),
    description: DEFAULT_DESCRIPTION,
    sameAs: SOCIAL_PROFILE_URLS.length > 0 ? SOCIAL_PROFILE_URLS : [SITE_URL],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SUPPORT_EMAIL,
      availableLanguage: ['English', 'Turkish'],
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'en-US',
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
}

export function softwareApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      url: absoluteUrl('/pricing'),
    },
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    featureList: [
      'Dynamic QR codes',
      'A/B variant routing',
      'Geofencing and schedule routing',
      'Team workspaces',
      'Scan webhooks',
      'Lead capture landing pages',
      'GPS scan heatmap',
      'NFC tag tracking',
      'REST API',
      'Custom scan domains',
      'GA4 and Meta Pixel',
      'Bulk CSV import',
      'Print banner export',
    ],
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function pricingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    brand: { '@type': 'Brand', name: SITE_NAME },
    url: absoluteUrl('/pricing'),
    offers: Object.values(PLANS).map((plan) => ({
      '@type': 'Offer',
      name: `${plan.name} Plan`,
      price: plan.priceMonthly ?? 0,
      priceCurrency: 'USD',
      url: absoluteUrl('/pricing'),
      availability: 'https://schema.org/InStock',
      description: `${plan.maxQrCodes} QR codes, ${plan.maxCustomDomains} custom domain(s), API access`,
    })),
  };
}

export function webPageJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: absoluteUrl(path),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    inLanguage: 'en-US',
  };
}

export const FAQ_ITEMS = [
  {
    question: 'What is a dynamic QR code?',
    answer:
      'A dynamic QR code points to a short link you control. You can change the destination URL, routing rules and analytics without reprinting the QR image.',
  },
  {
    question: 'Does QRbanner support geofencing?',
    answer:
      'Yes. You can route scanners to different URLs based on country and optional city, detected from IP. Combine with time-based and device rules.',
  },
  {
    question: 'Can I use my own domain for scan links?',
    answer:
      'Yes. Add a custom subdomain, verify DNS records and serve scans from your brand URL while managing codes in the QRbanner dashboard.',
  },
  {
    question: 'Is there a REST API?',
    answer:
      'Yes. QRbanner offers a v1 REST API to create and manage QR codes and folders. Generate an API key in Settings.',
  },
  {
    question: 'What happens to my QR codes if I cancel?',
    answer:
      'Unlike many competitors, QRbanner is designed so your dynamic codes can keep working on the Free plan after you downgrade or cancel, within plan limits.',
  },
  {
    question: 'Which analytics are included?',
    answer:
      'Track total and unique scans, custom date ranges, country, city, device, browser and OS breakdowns, GPS heatmaps, A/B variant stats and NFC vs QR source. Export CSV reports from the dashboard.',
  },
  {
    question: 'Can I bulk-create QR codes?',
    answer:
      'Yes. Upload a CSV to create many QR codes at once — ideal for stores, events and multi-location campaigns.',
  },
  {
    question: 'Do you support GA4 and Meta Pixel?',
    answer:
      'Yes. Attach Google Analytics 4 and Meta Pixel IDs to fire scan and CTA events on landing pages and redirects.',
  },
  {
    question: 'Can I receive webhooks when a QR is scanned?',
    answer:
      'Yes. Add webhook endpoints in Settings. Each scan sends a signed JSON payload you can connect to Zapier, Slack or your CRM.',
  },
  {
    question: 'Can landing pages collect leads?',
    answer:
      'Yes. Enable lead capture on any landing page to collect name, email, phone or message before redirecting visitors.',
  },
  {
    question: 'Does QRbanner support A/B testing?',
    answer:
      'Yes. Split traffic between multiple destination URLs with weighted variants, sticky cookies and per-variant analytics.',
  },
  {
    question: 'Can my team collaborate on QR codes?',
    answer:
      'Yes. Create team workspaces, invite members by email and assign roles. Switch workspaces from Settings.',
  },
  {
    question: 'Do you support SSO?',
    answer:
      'Yes. Sign in with Google or Microsoft Azure AD. Team workspaces can enforce SSO for members.',
  },
  {
    question: 'Does QRbanner support NFC tags?',
    answer:
      'Yes. Program NFC tags with the same dynamic URL. Scans are tracked separately as NFC in analytics.',
  },
  {
    question: 'How do I contact support?',
    answer:
      'Email us at support@qrbanner.com for help with your account, billing, QR codes or technical issues. We typically respond within one business day.',
  },
];
