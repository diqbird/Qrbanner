import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  GEO_CITIES,
  GEO_SECTOR_SLUGS,
  buildGeoPagePath,
  getGeoCityBySlug,
  geoCityName,
  geoCountryName,
} from '@/lib/geo-seo-pages';
import { getSolutionBySlug } from '@/lib/solutions';
import { pageMetadata } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { solutionSectorLabel } from '@/lib/i18n/solution-localize';

export const revalidate = 3600;

export function generateStaticParams() {
  return GEO_CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getGeoCityBySlug(params.city);
  if (!city) return {};
  const locale = await getServerLocale();
  const cityName = geoCityName(city, locale);
  const countryName = geoCountryName(city, locale);
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('geoSeo.cityMetaTitle').replace('{{city}}', cityName).replace('{{country}}', countryName),
    description: t('geoSeo.cityMetaDescription')
      .replace('{{city}}', cityName)
      .replace('{{country}}', countryName)
      .replace('{{count}}', formatLocaleNumber(GEO_SECTOR_SLUGS.length, locale)),
    path: `/geo/${city.slug}`,
    keywords: [`${cityName} QR code`, `QR codes ${cityName}`, `${countryName} QR generator`],
  });
}

export default async function GeoCityPage({ params }: { params: { city: string } }) {
  const city = getGeoCityBySlug(params.city);
  if (!city) notFound();

  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const cityName = geoCityName(city, locale);
  const countryName = geoCountryName(city, locale);

  return (
    <>
      <PublicBreadcrumbs
        items={[
          { label: t('geoSeo.breadcrumb'), href: '/geo' },
          { label: cityName, href: `/geo/${city.slug}` },
        ]}
      />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <header className="text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t('geoSeo.cityHeadline').replace('{{city}}', cityName)}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('geoSeo.cityIntro').replace('{{city}}', cityName).replace('{{country}}', countryName)}
            </p>
          </header>

          <ul className="mt-12 space-y-3">
            {GEO_SECTOR_SLUGS.map((sectorSlug) => {
              const solution = getSolutionBySlug(sectorSlug);
              if (!solution) return null;
              const sectorName = solutionSectorLabel(solution.slug, locale, solution.title);
              return (
                <li key={sectorSlug}>
                  <Link
                    href={buildGeoPagePath(city.slug, sectorSlug)}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/20"
                  >
                    <span className="text-sm font-medium">
                      {sectorName} — {cityName}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-12 text-center">
            <Link href="/geo">
              <Button variant="outline">{t('geoSeo.backToHub')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
