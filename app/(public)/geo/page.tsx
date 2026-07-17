import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GEO_CITIES, GEO_SECTOR_SLUGS, countGeoPages, geoCityName, geoCountryName } from '@/lib/geo-seo-pages';
import { getSolutionBySlug } from '@/lib/solutions';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { formatFreePlanDynamicQrLabel } from '@/lib/i18n/dynamic-qr-label';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { solutionSectorLabel } from '@/lib/i18n/solution-localize';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  return pageMetadata({
    locale,
    title: t('geoSeo.hubTitle'),
    description: t('geoSeo.hubDescription', { count: formatLocaleNumber(countGeoPages(), locale) }),
    path: '/geo',
    keywords: ['local QR code generator', 'city QR codes', 'industry QR by location'],
  });
}

export default async function GeoHubPage() {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const qrLabel = formatFreePlanDynamicQrLabel(locale);

  const featuredSectors = GEO_SECTOR_SLUGS.slice(0, 6)
    .map((slug) => getSolutionBySlug(slug))
    .filter(Boolean);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('geoSeo.hubTitle'),
          description: t('geoSeo.hubDescription', {
            count: formatLocaleNumber(countGeoPages(), locale),
          }),
          path: '/geo',
          locale,
        })}
      />
      <PremiumPageFrame narrow="5xl">
        <PublicBreadcrumbs items={[{ label: t('geoSeo.breadcrumb'), href: '/geo' }]} />
          <header className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t('geoSeo.hubHeadline')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('geoSeo.hubIntro')}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('geoSeo.hubStats', {
                cities: formatLocaleNumber(GEO_CITIES.length, locale),
                sectors: formatLocaleNumber(GEO_SECTOR_SLUGS.length, locale),
                pages: formatLocaleNumber(countGeoPages(), locale),
              })}
            </p>
          </header>

          <section className="mt-14">
            <h2 className="font-display text-xl font-semibold">{t('geoSeo.citiesTitle')}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {GEO_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={localizePath(`/geo/${city.slug}`, locale)}
                  className="rounded-lg border border-border/50 p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
                >
                  <p className="font-medium">{geoCityName(city, locale)}</p>
                  <p className="text-xs text-muted-foreground">
                    {geoCountryName(city, locale)}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="font-display text-xl font-semibold">{t('geoSeo.sectorsTitle')}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {featuredSectors.map((solution) =>
                solution ? (
                  <Link
                    key={solution.slug}
                    href={localizePath(`/solutions/${solution.slug}`, locale)}
                    className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium hover:border-primary/40 hover:text-primary"
                  >
                    {solutionSectorLabel(solution.slug, locale, solution.title)}
                  </Link>
                ) : null
              )}
            </div>
          </section>

          <div className="mt-14 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="font-display text-xl font-semibold">{t('geoSeo.ctaTitle')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('geoSeo.ctaBody', { qrLabel })}</p>
            <Link href="/qr/create" className="mt-4 inline-block">
              <Button className="gap-2">
                {t('geoSeo.ctaBtn')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
      </PremiumPageFrame>
    </>
  );
}
