import type { Metadata } from 'next';
import { getFaqItems } from '@/lib/i18n/faq-items';
import { faqJsonLd, pageMetadata, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { FaqPageContent } from '@/components/public/faq-page-content';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('faq.metaTitle'),
    description: t('faq.metaDescription'),
    path: '/faq',
    keywords: [
      'dynamic QR FAQ',
      'QR geofencing',
      'QR webhooks',
      'QR A/B testing',
      'QR custom domain',
      'QR API',
      'QR team workspace',
    ],
  });
}

export default async function FAQPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const pageTitle = t('faq.metaTitle');
  const pageDesc = t('faq.metaDescription');

  return (
    <>
      <JsonLd
        data={[
          faqJsonLd(getFaqItems(locale)),
          webPageJsonLd({ title: pageTitle, description: pageDesc, path: '/faq', locale }),
        ]}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <div className="mx-auto max-w-3xl">
            <PublicBreadcrumbs items={[{ label: t('nav.faq'), href: '/faq' }]} />
            <FaqPageContent />
          </div>
        </div>
      </PremiumShell>
    </>
  );
}
