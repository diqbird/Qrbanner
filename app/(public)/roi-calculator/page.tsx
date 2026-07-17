import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import { JsonLd } from '@/components/seo/json-ld';
import { RoiCalculator } from '@/components/marketing/roi-calculator';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
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
          locale,
        })}
      />
      <PremiumPageFrame narrow="5xl">
        <PublicBreadcrumbs items={[{ label: t('nav.roiCalculator'), href: '/roi-calculator' }]} />
          <header className="mb-10 max-w-2xl">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('roi.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('roi.subtitle')}</p>
          </header>
          <RoiCalculator />
      </PremiumPageFrame>
    </>
  );
}
