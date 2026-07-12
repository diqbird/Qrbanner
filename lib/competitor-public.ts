import type { CompetitorPage } from '@/lib/competitor-pages';
import { COMPETITOR_PAGES } from '@/lib/competitor-pages';
import { localizeCompetitorBody } from '@/lib/i18n/competitor-localize';
import { localizeMarketingNumbers } from '@/lib/i18n/qr-type-count';
import { localizePlanPricingInText } from '@/lib/i18n/plan-pricing-display';
import type { Locale } from '@/lib/i18n/types';

function pickLocaleText(
  locale: Locale,
  texts: { en: string; tr: string; de: string; es: string },
): string {
  if (locale === 'tr') return texts.tr;
  if (locale === 'de') return texts.de;
  if (locale === 'es') return texts.es;
  return texts.en;
}

function otherPlatformsLabel(locale?: Locale): string {
  return pickLocaleText(locale ?? 'en', {
    en: 'other platforms',
    tr: 'diğer platformlar',
    de: 'andere Plattformen',
    es: 'otras plataformas',
  });
}

const BRAND_NAMES = Array.from(
  new Set(
    COMPETITOR_PAGES.flatMap((p) => {
      const parts = p.name.split(/[()]/).map((s) => s.trim()).filter(Boolean);
      return [p.name, ...parts];
    })
  )
).sort((a, b) => b.length - a.length);

export function sanitizeCompetitorBrands(text: string, locale?: Locale): string {
  const platforms = otherPlatformsLabel(locale);
  let out = text;
  for (const brand of BRAND_NAMES) {
    if (brand.length < 2) continue;
    const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(escaped, 'gi'), platforms);
  }
  out = out.replace(/QRbanner vs [^—–\n.]+/gi, `QRbanner vs ${platforms}`);
  out = out.replace(/\bvs [A-Z][A-Za-z0-9 .+'’-]+/g, `vs ${platforms}`);
  out = out.replace(new RegExp(`\\b${platforms.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'s\\b`, 'gi'), `${platforms}'`);
  out = out.replace(/\s{2,}/g, ' ').trim();
  if (locale) {
    out = localizeMarketingNumbers(out, locale);
    out = localizePlanPricingInText(out, locale);
  }
  return out;
}

export function getComparisonTopic(slug: string, locale: Locale): string {
  const linkBio = new Set(['linktree', 'taplink', 'onelink', 'sniply']);
  const shorteners = new Set([
    'bitly', 'tinyurl', 'short-io', 'rebrandly', 'blink', 'cuttly', 'delivr', 'blinq',
  ]);
  const design = new Set(['canva', 'wix', 'godaddy', 'squarespace', 'adobe-express']);
  const visual = new Set(['flowcode', 'hovercode', 'visualead', 'qrcodechimp']);
  const enterprise = new Set(['uniqode', 'beaconstac', 'scantrust', 'scanova', 'scanova-alternative']);

  if (linkBio.has(slug)) {
    return pickLocaleText(locale, {
      en: 'Link-in-bio tools',
      tr: 'Link-in-bio araçları',
      de: 'Link-in-Bio-Tools',
      es: 'Herramientas link-in-bio',
    });
  }
  if (shorteners.has(slug)) {
    return pickLocaleText(locale, {
      en: 'URL shorteners',
      tr: 'URL kısaltıcılar',
      de: 'URL-Kürzer',
      es: 'Acortadores de URL',
    });
  }
  if (design.has(slug)) {
    return pickLocaleText(locale, {
      en: 'Design platforms',
      tr: 'Tasarım platformları',
      de: 'Design-Plattformen',
      es: 'Plataformas de diseño',
    });
  }
  if (visual.has(slug)) {
    return pickLocaleText(locale, {
      en: 'Visual QR tools',
      tr: 'Görsel QR araçları',
      de: 'Visuelle QR-Tools',
      es: 'Herramientas QR visuales',
    });
  }
  if (enterprise.has(slug)) {
    return pickLocaleText(locale, {
      en: 'Enterprise QR suites',
      tr: 'Kurumsal QR paketleri',
      de: 'Enterprise-QR-Suiten',
      es: 'Suites QR empresariales',
    });
  }
  return pickLocaleText(locale, {
    en: 'QR code platform',
    tr: 'QR kod platformu',
    de: 'QR-Code-Plattform',
    es: 'Plataforma de códigos QR',
  });
}

export function getPublicListTitle(page: CompetitorPage, locale: Locale): string {
  const topic = getComparisonTopic(page.slug, locale);
  return pickLocaleText(locale, {
    en: `${topic} comparison`,
    tr: `${topic} karşılaştırması`,
    de: `${topic}-Vergleich`,
    es: `Comparativa de ${topic}`,
  });
}

function localizePublicPage(page: CompetitorPage, locale: Locale): CompetitorPage {
  if (locale === 'en') return page;
  return localizeCompetitorBody(page, locale, getComparisonTopic(page.slug, locale));
}

export function getPublicComparisonMeta(page: CompetitorPage, locale: Locale) {
  const topic = getComparisonTopic(page.slug, locale);
  const localized = localizePublicPage(page, locale);
  const title = pickLocaleText(locale, {
    en: `${topic} — QRbanner comparison`,
    tr: `${topic} — QRbanner karşılaştırması`,
    de: `${topic} — QRbanner-Vergleich`,
    es: `${topic} — comparativa QRbanner`,
  });
  const description = sanitizeCompetitorBrands(localized.metaDescription, locale);
  return { title, description };
}

export function getPublicComparisonView(page: CompetitorPage, locale: Locale) {
  const localized = localizePublicPage(page, locale);
  const typicalLabel = pickLocaleText(locale, {
    en: 'Typical alternative',
    tr: 'Tipik alternatif',
    de: 'Typische Alternative',
    es: 'Alternativa típica',
  });
  const considerationsTitle = pickLocaleText(locale, {
    en: 'Alternative considerations',
    tr: 'Alternatif değerlendirmesi',
    de: 'Alternative Überlegungen',
    es: 'Consideraciones sobre alternativas',
  });

  return {
    breadcrumbLabel: getComparisonTopic(page.slug, locale),
    listTitle: getPublicListTitle(page, locale),
    headline: sanitizeCompetitorBrands(localized.headline, locale),
    summary: sanitizeCompetitorBrands(localized.summary, locale),
    qrbannerWins: localized.qrbannerWins.map((w) => sanitizeCompetitorBrands(w, locale)),
    competitorWeaknesses: localized.competitorWeaknesses.map((w) =>
      sanitizeCompetitorBrands(w, locale),
    ),
    comparisonRows: localized.comparisonRows.map((row) => ({
      feature: sanitizeCompetitorBrands(row.feature, locale),
      qrbanner: sanitizeCompetitorBrands(row.qrbanner, locale),
      competitor: sanitizeCompetitorBrands(row.competitor, locale),
    })),
    typicalLabel,
    considerationsTitle,
    meta: getPublicComparisonMeta(page, locale),
  };
}

/** Localized, brand-sanitized summary for /vs index cards. */
export function getPublicComparisonSummary(page: CompetitorPage, locale: Locale): string {
  const localized = localizePublicPage(page, locale);
  return sanitizeCompetitorBrands(localized.summary, locale);
}
