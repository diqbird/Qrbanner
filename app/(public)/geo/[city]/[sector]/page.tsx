import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  buildGeoPageContent,
  buildGeoPagePath,
  geoCityName,
  getGeoCityBySlug,
  isGeoSectorSlug,
  listGeoComboParams,
} from '@/lib/geo-seo-pages';
import { pageMetadata, webPageJsonLd, faqJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { ProgrammaticPageShell } from '@/components/seo/programmatic-page-shell';
import { ProgrammaticInternalLinks } from '@/components/seo/programmatic-internal-links';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { formatFreePlanDynamicQrLabel } from '@/lib/i18n/dynamic-qr-label';
import { solutionSectorLabel, localizeSolutionPage } from '@/lib/i18n/solution-localize';

export const revalidate = 3600;

export function generateStaticParams() {
  return listGeoComboParams();
}

export async function generateMetadata({
  params,
}: {
  params: { city: string; sector: string };
}): Promise<Metadata> {
  if (!isGeoSectorSlug(params.sector)) return {};
  const city = getGeoCityBySlug(params.city);
  if (!city) return {};
  const locale = await getServerLocale();
  const page = buildGeoPageContent(city, params.sector, locale);
  if (!page) return {};
  return pageMetadata({
    locale,
    title: page.title,
    description: page.metaDescription,
    path: page.path,
    keywords: page.keywords,
  });
}

export default async function GeoSectorPage({
  params,
}: {
  params: { city: string; sector: string };
}) {
  if (!isGeoSectorSlug(params.sector)) notFound();
  const city = getGeoCityBySlug(params.city);
  if (!city) notFound();

  const locale = await getServerLocale();
  const page = buildGeoPageContent(city, params.sector, locale);
  if (!page) notFound();

  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const qrLabel = formatFreePlanDynamicQrLabel(locale);
  const cityName = geoCityName(city, locale);
  const sectorLabel = solutionSectorLabel(page.solution.slug, locale, page.solution.title);
  const createUrl = page.solution.categoryId
    ? `/qr/create?category=${page.solution.categoryId}`
    : '/qr/create';

  const howAnswer = page.steps.length
    ? page.steps.map((step, i) => `${i + 1}. ${step}`).join(' ')
    : page.description;

  const faqItems = [
    {
      question: t('geoSeo.faqWhatQ', { city: cityName, sector: sectorLabel }),
      answer: page.description,
    },
    {
      question: t('geoSeo.faqHowQ', { city: cityName, sector: sectorLabel }),
      answer: howAnswer,
    },
    {
      question: t('geoSeo.faqWhyQ', { city: cityName }),
      answer: t('geoSeo.faqWhyA', { city: cityName }),
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            title: page.title,
            description: page.metaDescription,
            path: page.path,
            locale,
          }),
          faqJsonLd(faqItems),
        ]}
      />
      <ProgrammaticPageShell
        breadcrumbs={[
          { label: t('geoSeo.breadcrumb'), href: '/geo' },
          { label: cityName, href: `/geo/${city.slug}` },
          { label: sectorLabel, href: page.path },
        ]}
        headline={page.headline}
        description={page.description}
        primaryHref={createUrl}
        primaryLabel={t('geoSeo.createLabel')}
        sections={[
          { title: t('geoSeo.benefitsTitle'), items: page.benefits },
          { title: t('geoSeo.stepsTitle'), items: page.steps, ordered: true },
        ]}
        faqTitle={t('geoSeo.faqTitle')}
        faqItems={faqItems}
        ctaTitle={t('geoSeo.detailCtaTitle').replace('{{city}}', cityName)}
        ctaBody={t('geoSeo.detailCtaBody', { qrLabel })}
      />
      <div className="border-t border-border/40 bg-muted/20 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground">{t('geoSeo.relatedSolution')}</p>
          <Link
            href={localizePath(`/solutions/${page.solution.slug}`, locale)}
            className="mt-3 inline-block"
          >
            <Button variant="outline" className="gap-2">
              {localizeSolutionPage(page.solution, locale).title} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="pb-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ProgrammaticInternalLinks
            variant="compact"
            extraLinks={[
              {
                href: `/geo/${city.slug}`,
                label: t('geoSeo.allSectorsIn').replace('{{city}}', cityName),
              },
              { href: buildGeoPagePath(city.slug, params.sector), label: page.title },
            ]}
          />
        </div>
      </div>
    </>
  );
}
