import type { Metadata } from 'next';
import { Suspense } from 'react';
import { pageMetadata, pricingJsonLd, webPageJsonLd, faqJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PricingPageContent } from '@/components/public/pricing-page-content';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { getPricingFaqItems } from '@/lib/i18n/pricing-faq-items';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { formatFreePlanDynamicQrLabel } from '@/lib/i18n/dynamic-qr-label';
import { pricingMetaVars } from '@/lib/i18n/plan-pricing-display';
import { getPublicBillingStatus } from '@/lib/public-billing-status';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const qrLabel = formatFreePlanDynamicQrLabel(locale);
  const metaVars = { qrLabel, ...pricingMetaVars(locale) };
  return pageMetadata({
    locale,
    title: t('pricing.metaTitle'),
    description: t('pricing.metaDescription', metaVars),
    path: '/pricing',
    keywords: ['QR code pricing', 'free dynamic QR', 'QR SaaS plans', 'QR code subscription'],
  });
}

export default async function PricingPage() {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const qrLabel = formatFreePlanDynamicQrLabel(locale);
  const metaVars = { qrLabel, ...pricingMetaVars(locale) };
  const pageTitle = t('pricing.metaTitle');
  const pageDesc = t('pricing.metaDescription', metaVars);
  const initialBillingStatus = getPublicBillingStatus();

  return (
    <>
      <JsonLd
        data={[
          pricingJsonLd(),
          webPageJsonLd({ title: pageTitle, description: pageDesc, path: '/pricing', locale }),
          faqJsonLd(getPricingFaqItems(locale)),
        ]}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <PublicBreadcrumbs items={[{ label: t('nav.pricing'), href: '/pricing' }]} />
          <Suspense fallback={null}>
            <PricingPageContent initialBillingStatus={initialBillingStatus} />
          </Suspense>
        </div>
      </PremiumShell>
    </>
  );
}
