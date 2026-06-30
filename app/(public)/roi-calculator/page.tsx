import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { RoiCalculator } from '@/components/marketing/roi-calculator';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('roi.metaTitle'),
    description: t('roi.metaDescription'),
    path: '/roi-calculator',
  });
}

export default async function RoiCalculatorPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('roi.title'),
          description: t('roi.subtitle'),
          path: '/roi-calculator',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('nav.roiCalculator'), href: '/roi-calculator' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <header className="mb-10 max-w-2xl">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('roi.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('roi.subtitle')}</p>
          </header>
          <RoiCalculator />
        </div>
      </div>
    </>
  );
}
