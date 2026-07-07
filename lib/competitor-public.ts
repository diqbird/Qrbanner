import type { CompetitorPage } from '@/lib/competitor-pages';
import { COMPETITOR_PAGES } from '@/lib/competitor-pages';
import { localizeMarketingNumbers } from '@/lib/i18n/qr-type-count';
import { localizePlanPricingInText } from '@/lib/i18n/plan-pricing-display';
import type { Locale } from '@/lib/i18n/types';

const BRAND_NAMES = Array.from(
  new Set(
    COMPETITOR_PAGES.flatMap((p) => {
      const parts = p.name.split(/[()]/).map((s) => s.trim()).filter(Boolean);
      return [p.name, ...parts];
    })
  )
).sort((a, b) => b.length - a.length);

export function sanitizeCompetitorBrands(text: string, locale?: Locale): string {
  let out = text;
  for (const brand of BRAND_NAMES) {
    if (brand.length < 2) continue;
    const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(escaped, 'gi'), 'other platforms');
  }
  out = out.replace(/QRbanner vs [^—–\n.]+/gi, 'QRbanner vs other platforms');
  out = out.replace(/\bvs [A-Z][A-Za-z0-9 .+'’-]+/g, 'vs other platforms');
  out = out.replace(/\bother platforms's\b/gi, "other platforms'");
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
    return locale === 'tr' ? 'Link-in-bio araçları' : 'Link-in-bio tools';
  }
  if (shorteners.has(slug)) {
    return locale === 'tr' ? 'URL kısaltıcılar' : 'URL shorteners';
  }
  if (design.has(slug)) {
    return locale === 'tr' ? 'Tasarım platformları' : 'Design platforms';
  }
  if (visual.has(slug)) {
    return locale === 'tr' ? 'Görsel QR araçları' : 'Visual QR tools';
  }
  if (enterprise.has(slug)) {
    return locale === 'tr' ? 'Kurumsal QR paketleri' : 'Enterprise QR suites';
  }
  return locale === 'tr' ? 'QR kod platformu' : 'QR code platform';
}

export function getPublicListTitle(page: CompetitorPage, locale: Locale): string {
  const topic = getComparisonTopic(page.slug, locale);
  return locale === 'tr' ? `${topic} karşılaştırması` : `${topic} comparison`;
}

export function getPublicComparisonMeta(page: CompetitorPage, locale: Locale) {
  const topic = getComparisonTopic(page.slug, locale);
  const title =
    locale === 'tr'
      ? `${topic} — QRbanner karşılaştırması`
      : `${topic} — QRbanner comparison`;
  const description = sanitizeCompetitorBrands(page.metaDescription, locale);
  return { title, description };
}

export function getPublicComparisonView(page: CompetitorPage, locale: Locale) {
  const typicalLabel = locale === 'tr' ? 'Tipik alternatif' : 'Typical alternative';
  const considerationsTitle =
    locale === 'tr' ? 'Alternatif değerlendirmesi' : 'Alternative considerations';

  return {
    breadcrumbLabel: getComparisonTopic(page.slug, locale),
    listTitle: getPublicListTitle(page, locale),
    headline: sanitizeCompetitorBrands(page.headline, locale),
    summary: sanitizeCompetitorBrands(page.summary, locale),
    qrbannerWins: page.qrbannerWins.map((w) => sanitizeCompetitorBrands(w, locale)),
    competitorWeaknesses: page.competitorWeaknesses.map((w) => sanitizeCompetitorBrands(w, locale)),
    comparisonRows: page.comparisonRows.map((row) => ({
      feature: sanitizeCompetitorBrands(row.feature, locale),
      qrbanner: sanitizeCompetitorBrands(row.qrbanner, locale),
      competitor: sanitizeCompetitorBrands(row.competitor, locale),
    })),
    typicalLabel,
    considerationsTitle,
    meta: getPublicComparisonMeta(page, locale),
  };
}
