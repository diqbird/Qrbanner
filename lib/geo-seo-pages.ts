import type { Locale } from '@/lib/i18n/types';
import type { SolutionPage } from '@/lib/solutions';
import { getSolutionBySlug } from '@/lib/solutions';
import { GEO_CITIES, getGeoCityBySlug, type GeoCity } from '@/lib/geo-seo-cities';

export type { GeoCity };
export { GEO_CITIES, getGeoCityBySlug };

/** Featured sectors crossed with cities for programmatic local SEO. */
export const GEO_SECTOR_SLUGS = [
  'restaurant-menu',
  'retail-stores',
  'hotels-hospitality',
  'healthcare-clinics',
  'real-estate',
  'fitness-gyms',
  'event-rsvp',
  'marketing-agencies',
  'university-campus',
  'trade-shows-expos',
  'business-card',
  'wifi-guest',
] as const;

export type GeoSectorSlug = (typeof GEO_SECTOR_SLUGS)[number];

export interface GeoPageContent {
  city: GeoCity;
  sectorSlug: GeoSectorSlug;
  solution: SolutionPage;
  title: string;
  headline: string;
  metaDescription: string;
  keywords: string[];
  description: string;
  benefits: string[];
  steps: string[];
  path: string;
}

export function isGeoSectorSlug(slug: string): slug is GeoSectorSlug {
  return (GEO_SECTOR_SLUGS as readonly string[]).includes(slug);
}

export function buildGeoPagePath(citySlug: string, sectorSlug: string): string {
  return `/geo/${citySlug}/${sectorSlug}`;
}

function sectorLabel(solution: SolutionPage, locale: Locale): string {
  const base = solution.title.replace(/\s+QR Code$/i, '').replace(/\s+QR$/i, '');
  return locale === 'tr' ? base : base;
}

export function buildGeoPageContent(
  city: GeoCity,
  sectorSlug: GeoSectorSlug,
  locale: Locale
): GeoPageContent | null {
  const solution = getSolutionBySlug(sectorSlug);
  if (!solution) return null;

  const cityName = locale === 'tr' ? city.nameTr : city.name;
  const countryName = locale === 'tr' ? city.countryTr : city.country;
  const sector = sectorLabel(solution, locale);
  const path = buildGeoPagePath(city.slug, sectorSlug);

  if (locale === 'tr') {
    return {
      city,
      sectorSlug,
      solution,
      path,
      title: `${cityName} ${sector} QR Kodu`,
      headline: `${cityName}'da ${sector.toLowerCase()} için dinamik QR kodları`,
      metaDescription: `${cityName}, ${countryName} için ${sector.toLowerCase()} QR kodu oluşturun. Tarama analitiği, coğrafi yönlendirme ve baskıya hazır tasarımlar — QRbanner ile ücretsiz başlayın.`,
      keywords: [
        `${cityName} QR kodu`,
        `${sector} QR kodu ${cityName}`,
        `${cityName} dinamik QR`,
        `${countryName} QR kod oluşturucu`,
      ],
      description: `${cityName} ve çevresindeki ${sector.toLowerCase()} işletmeleri için dinamik QR kodları oluşturun. Linkleri baskıyı değiştirmeden güncelleyin, taramaları ülke ve cihaza göre izleyin.`,
      benefits: [
        `${cityName} kampanyaları için tarama analitiği ve coğrafi raporlar`,
        `${sector} iş akışlarına uygun hazır şablonlar`,
        `Coğrafi yönlendirme ile ${countryName} genelinde doğru açılış sayfası`,
        'Slack, e-posta ve CRM webhook otomasyonları',
        ...solution.benefits.slice(0, 2),
      ],
      steps: solution.steps.map((s) => s.title),
    };
  }

  return {
    city,
    sectorSlug,
    solution,
    path,
    title: `${sector} QR Codes in ${cityName}`,
    headline: `Dynamic QR codes for ${sector.toLowerCase()} in ${cityName}`,
    metaDescription: `Create ${sector.toLowerCase()} QR codes for ${cityName}, ${countryName}. Scan analytics, geofence routing and print-ready designs — start free on QRbanner.`,
    keywords: [
      `${cityName} QR code`,
      `${sector} QR code ${cityName}`,
      `${cityName} dynamic QR`,
      `${countryName} QR code generator`,
    ],
    description: `Launch dynamic QR codes for ${sector.toLowerCase()} businesses in ${cityName} and the surrounding metro. Update links without reprinting and track scans by country and device.`,
    benefits: [
      `Scan analytics and geo reports for ${cityName} campaigns`,
      `Industry templates tuned for ${sector.toLowerCase()} workflows`,
      `Geofence routing across ${countryName} for the right landing page`,
      'Slack, email and CRM webhook automations',
      ...solution.benefits.slice(0, 2),
    ],
    steps: solution.steps.map((s) => s.title),
  };
}

export function listGeoComboParams(): { city: string; sector: string }[] {
  return GEO_CITIES.flatMap((city) =>
    GEO_SECTOR_SLUGS.map((sector) => ({ city: city.slug, sector }))
  );
}

export function countGeoPages(): number {
  return GEO_CITIES.length * GEO_SECTOR_SLUGS.length;
}
