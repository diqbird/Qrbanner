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

/** BCP 47 language tag for Schema.org `inLanguage` and HTML lang. */
export function localeToBcp47(locale: Locale = 'en'): string {
  if (locale === 'tr') return 'tr-TR';
  if (locale === 'de') return 'de-DE';
  if (locale === 'es') return 'es-ES';
  return 'en-US';
}

/** Absolute URL for a path in a given locale (EN unprefixed). */
export function absoluteLocalizedUrl(path = '/', locale: Locale = 'en'): string {
  return absoluteUrl(localizePath(path, locale));
}

/** hreflang alternates — English at canonical path; TR/DE/ES under prefixed paths. */
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
  const deUrl = absoluteUrl(localizePath(normalized, 'de'));
  const esUrl = absoluteUrl(localizePath(normalized, 'es'));
  return {
    canonical: enUrl,
    languages: {
      en: enUrl,
      tr: trUrl,
      de: deUrl,
      es: esUrl,
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
  const deUrl = absoluteUrl(localizePath(normalized, 'de'));
  const esUrl = absoluteUrl(localizePath(normalized, 'es'));

  if (!localized) {
    return { canonical: enUrl, languages: { en: enUrl, 'x-default': enUrl } };
  }

  const canonical =
    locale === 'tr' ? trUrl : locale === 'de' ? deUrl : locale === 'es' ? esUrl : enUrl;
  return {
    canonical,
    languages: {
      en: enUrl,
      tr: trUrl,
      de: deUrl,
      es: esUrl,
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
  openGraphType = 'website',
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  locale?: Locale;
  openGraphType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const alternates = hreflangAlternatesForLocale(normalized, locale);
  const canonical = alternates?.canonical;
  const url = typeof canonical === 'string' ? canonical : absoluteLocalizedUrl(normalized, locale);
  const twitterHandle = process.env.NEXT_PUBLIC_SOCIAL_TWITTER?.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//i, '@');

  const ogTitle = normalized === '/' ? `${SITE_NAME} — ${title}` : title;
  const openGraph: Metadata['openGraph'] = {
    type: openGraphType,
    locale: locale === 'tr' ? 'tr_TR' : locale === 'de' ? 'de_DE' : locale === 'es' ? 'es_ES' : 'en_US',
    url,
    siteName: SITE_NAME,
    title: ogTitle,
    description,
    images: [OG_IMAGE],
    ...(openGraphType === 'article'
      ? {
          publishedTime,
          modifiedTime: modifiedTime ?? publishedTime,
        }
      : {}),
  };

  return {
    title,
    description,
    keywords,
    alternates,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [OG_IMAGE.url],
      ...(twitterHandle ? { site: twitterHandle, creator: twitterHandle } : {}),
    },
  };
}

export function getHomepageFaqItems(locale: Locale = 'en') {
  return getFaqItems(locale).slice(0, HOMEPAGE_FAQ_COUNT);
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
      availableLanguage: ['English', 'Turkish', 'German', 'Spanish'],
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
    inLanguage: ['en-US', 'tr-TR', 'de-DE', 'es-ES'],
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/templates?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function softwareApplicationJsonLd() {
  const free = PLANS.free;
  const pro = PLANS.pro;
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: String(free.priceMonthly ?? 0),
      highPrice: String(pro.priceMonthly ?? 9.99),
      priceCurrency: 'USD',
      offerCount: Object.keys(PLANS).length,
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

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: Locale = 'en'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteLocalizedUrl(item.path, locale),
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

export function itemListJsonLd(
  items: { name: string; path: string }[],
  locale: Locale = 'en'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteLocalizedUrl(item.path, locale),
    })),
  };
}

export function comparisonPageJsonLd({
  title,
  description,
  path,
  faq,
  locale = 'en',
}: {
  title: string;
  description: string;
  path: string;
  faq?: { question: string; answer: string }[];
  locale?: Locale;
}) {
  const graph: Record<string, unknown>[] = [
    webPageJsonLd({ title, description, path, locale }),
    breadcrumbJsonLd(
      [
        { name: 'Comparisons', path: '/vs' },
        { name: title, path },
      ],
      locale
    ),
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
  locale = 'en',
}: {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: absoluteLocalizedUrl(path, locale),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    inLanguage: localeToBcp47(locale),
  };
}

/** Product + Offer for a published community marketplace listing. */
export function marketplaceListingJsonLd({
  id,
  title,
  description,
  priceCents,
  currency = 'usd',
  sellerName,
  locale = 'en',
}: {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  currency?: string;
  sellerName: string;
  locale?: Locale;
}) {
  const path = `/marketplace/${id}`;
  const price = (Math.max(0, priceCents) / 100).toFixed(2);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description.slice(0, 5000),
    url: absoluteLocalizedUrl(path, locale),
    brand: { '@type': 'Brand', name: SITE_NAME },
    seller: { '@type': 'Organization', name: sellerName },
    offers: {
      '@type': 'Offer',
      url: absoluteLocalizedUrl(path, locale),
      price,
      priceCurrency: currency.toUpperCase(),
      availability: 'https://schema.org/InStock',
    },
  };
}
