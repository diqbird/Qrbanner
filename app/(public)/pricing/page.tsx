import type { Metadata } from 'next';
import { Suspense } from 'react';
import { pageMetadata, pricingJsonLd, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PricingPageContent } from '@/components/public/pricing-page-content';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('pricing.metaTitle'),
    description: t('pricing.metaDescription'),
    path: '/pricing',
    keywords: ['QR code pricing', 'free dynamic QR', 'QR SaaS plans', 'QR code subscription'],
  });
}

export default async function PricingPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const pageTitle = t('pricing.metaTitle');
  const pageDesc = t('pricing.metaDescription');

  return (
    <>
      <JsonLd data={[pricingJsonLd(), webPageJsonLd({ title: pageTitle, description: pageDesc, path: '/pricing' })]} />
      <PublicBreadcrumbs items={[{ label: t('nav.pricing'), href: '/pricing' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Suspense fallback={null}>
            <PricingPageContent />
          </Suspense>
        </div>
      </div>
    </>
  );
}
