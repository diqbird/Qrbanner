import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { FeaturesPageContent } from '@/components/public/features-page-content';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('features.metaTitle'),
    description: t('features.metaDescription'),
    path: '/features',
    keywords: [
      'QR code features',
      'dynamic QR platform',
      'QR geofencing',
      'QR A/B testing',
      'QR webhooks',
      'QR team workspace',
      'QR lead capture',
      'QR GPS heatmap',
    ],
  });
}

export default async function FeaturesPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('features.pageTitle'),
          description: t('features.pageSubtitle'),
          path: '/features',
          locale,
        })}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <PublicBreadcrumbs items={[{ label: t('nav.features'), href: '/features' }]} />
          <FeaturesPageContent />
        </div>
      </PremiumShell>
    </>
  );
}
