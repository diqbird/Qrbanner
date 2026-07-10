import type { Metadata } from 'next';
import { PLANS } from '@/lib/plans';
import { getFaqItems } from '@/lib/i18n/faq-items';
import { SUPPORT_EMAIL } from '@/lib/site-contact';
import { localizePath, shouldLocalizePath } from '@/lib/i18n/locale-path';
import type { Locale } from '@/lib/i18n/types';

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
  if (p === '/') return SITE_URL;
  return `${SITE_URL}${p}`;
}

/** hreflang alternates — English at canonical path, Turkish at /tr/... */
export function hreflangAlternates(path = '/'): Metadata['alternates'] {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const enUrl = absoluteUrl(normalized);
  const localized = shouldLocalizePath(normalized);

  if (!localized) {
    return {
      canonical: enUrl,
      languages: {
        en: enUrl,
        'x-default': enUrl,
      },
    };
  }

  const trUrl = absoluteUrl(localizePath(normalized, 'tr'));
  return {
    canonical: enUrl,
    languages: {
      en: enUrl,
      tr: trUrl,
      'x-default': enUrl,
    },
  };
}

/** Canonical + hreflang for a specific locale (use in generateMetadata). */
export function hreflangAlternatesForLocale(
  path = '/',
  locale: Locale = 'en'
): Metadata['alternates'] {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const localized = shouldLocalizePath(normalized);
  const enUrl = absoluteUrl(normalized);
  const trUrl = absoluteUrl(localizePath(normalized, 'tr'));

  if (!localized) {
    return { canonical: enUrl, languages: { en: enUrl, 'x-default': enUrl } };
  }

  const canonical = locale === 'tr' ? trUrl : enUrl;
  return {
    canonical,
    languages: {
      en: enUrl,
      tr: trUrl,
      'x-default': enUrl,
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
  locale = 'en',
}: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  locale?: Locale;
}): Metadata {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const alternates = hreflangAlternatesForLocale(normalized, locale);
  const canonical = alternates?.canonical;
  const url = typeof canonical === 'string' ? canonical : absoluteUrl(normalized);
  const fullTitle = normalized === '/' ? title : title;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      url,
      siteName: SITE_NAME,
      title: normalized === '/' ? `${SITE_NAME} — ${title}` : title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: normalized === '/' ? `${SITE_NAME} — ${title}` : title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export function getHomepageFaqItems() {
  return getFaqItems('en').slice(0, HOMEPAGE_FAQ_COUNT);
}

/** English FAQ list for JSON-LD and legacy imports */
export const FAQ_ITEMS = getFaqItems('en');

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
      'OpenAPI specification',
      'Landing page CTA analytics',
      'AI-assisted landing copy',
      'TOTP two-factor authentication',
      'SAML SSO for Business workspaces',
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

export function itemListJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function comparisonPageJsonLd({
  title,
  description,
  path,
  faq,
}: {
  title: string;
  description: string;
  path: string;
  faq?: { question: string; answer: string }[];
}) {
  const graph: Record<string, unknown>[] = [
    webPageJsonLd({ title, description, path }),
    breadcrumbJsonLd([
      { name: 'Comparisons', path: '/vs' },
      { name: title, path },
    ]),
  ];
  if (faq?.length) {
    graph.push(faqJsonLd(faq));
  }
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
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
