import type { Locale } from '@/lib/i18n/types';
import type { SolutionPage } from '@/lib/solutions';
import { getSolutionBySlug } from '@/lib/solutions';
import { solutionSectorLabel } from '@/lib/i18n/solution-localize';
import { intlLocaleTag } from '@/lib/i18n/locale-dictionary';
import { ANALYTICS_CITY_EN_TO_DE, ANALYTICS_CITY_EN_TO_ES } from '@/lib/analytics-city-names';
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
  return solutionSectorLabel(solution.slug, locale, solution.title);
}

export function geoCityName(city: GeoCity, locale: Locale): string {
  if (locale === 'tr') return city.nameTr;
  const key = city.name.toLowerCase();
  if (locale === 'de') return ANALYTICS_CITY_EN_TO_DE[key] ?? city.name;
  if (locale === 'es') return ANALYTICS_CITY_EN_TO_ES[key] ?? city.name;
  return city.name;
}

export function geoCountryName(city: GeoCity, locale: Locale): string {
  if (locale === 'tr') return city.countryTr;
  if (locale === 'de' || locale === 'es') {
    try {
      return new Intl.DisplayNames([intlLocaleTag(locale)], { type: 'region' }).of(city.countryCode) ?? city.country;
    } catch {
      return city.country;
    }
  }
  return city.country;
}

export function buildGeoPageContent(
  city: GeoCity,
  sectorSlug: GeoSectorSlug,
  locale: Locale
): GeoPageContent | null {
  const solution = getSolutionBySlug(sectorSlug);
  if (!solution) return null;

  const cityName = geoCityName(city, locale);
  const countryName = geoCountryName(city, locale);
  const sector = sectorLabel(solution, locale);
  const path = buildGeoPagePath(city.slug, sectorSlug);
  const sectorLower = sector.toLowerCase();

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

  if (locale === 'de') {
    return {
      city,
      sectorSlug,
      solution,
      path,
      title: `${sector} QR-Code in ${cityName}`,
      headline: `Dynamische QR-Codes für ${sectorLower} in ${cityName}`,
      metaDescription: `Erstellen Sie ${sectorLower} QR-Codes für ${cityName}, ${countryName}. Scan-Analysen, Geofencing-Routing und druckfertige Designs — kostenlos starten mit QRbanner.`,
      keywords: [
        `${cityName} QR-Code`,
        `${sector} QR-Code ${cityName}`,
        `${cityName} dynamischer QR`,
        `${countryName} QR-Code Generator`,
      ],
      description: `Starten Sie dynamische QR-Codes für ${sectorLower}-Unternehmen in ${cityName} und der Metro-Region. Links ohne Neudruck aktualisieren und Scans nach Land und Gerät verfolgen.`,
      benefits: [
        `Scan-Analysen und Geo-Berichte für ${cityName}-Kampagnen`,
        `Branchenvorlagen für ${sectorLower}-Workflows`,
        `Geofencing-Routing in ${countryName} für die richtige Landingpage`,
        'Slack-, E-Mail- und CRM-Webhook-Automatisierungen',
        ...solution.benefits.slice(0, 2),
      ],
      steps: solution.steps.map((s) => s.title),
    };
  }

  if (locale === 'es') {
    return {
      city,
      sectorSlug,
      solution,
      path,
      title: `Código QR de ${sector} en ${cityName}`,
      headline: `Códigos QR dinámicos para ${sectorLower} en ${cityName}`,
      metaDescription: `Cree códigos QR de ${sectorLower} para ${cityName}, ${countryName}. Analítica de escaneos, enrutamiento geográfico y diseños listos para imprimir — empiece gratis en QRbanner.`,
      keywords: [
        `código QR ${cityName}`,
        `código QR ${sector} ${cityName}`,
        `QR dinámico ${cityName}`,
        `generador QR ${countryName}`,
      ],
      description: `Lance códigos QR dinámicos para negocios de ${sectorLower} en ${cityName} y el área metropolitana. Actualice enlaces sin reimprimir y siga escaneos por país y dispositivo.`,
      benefits: [
        `Analítica de escaneos e informes geo para campañas en ${cityName}`,
        `Plantillas del sector adaptadas a flujos de ${sectorLower}`,
        `Enrutamiento geográfico en ${countryName} hacia la landing correcta`,
        'Automatizaciones webhook para Slack, email y CRM',
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
    headline: `Dynamic QR codes for ${sectorLower} in ${cityName}`,
    metaDescription: `Create ${sectorLower} QR codes for ${cityName}, ${countryName}. Scan analytics, geofence routing and print-ready designs — start free on QRbanner.`,
    keywords: [
      `${cityName} QR code`,
      `${sector} QR code ${cityName}`,
      `${cityName} dynamic QR`,
      `${countryName} QR code generator`,
    ],
    description: `Launch dynamic QR codes for ${sectorLower} businesses in ${cityName} and the surrounding metro. Update links without reprinting and track scans by country and device.`,
    benefits: [
      `Scan analytics and geo reports for ${cityName} campaigns`,
      `Industry templates tuned for ${sectorLower} workflows`,
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
