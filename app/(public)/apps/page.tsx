import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { MobileAppsPageContent } from '@/components/public/mobile-apps-page-content';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('mobileApps.metaTitle'),
    description: t('mobileApps.metaDescription'),
    path: '/apps',
    keywords: ['QR code mobile app', 'QR PWA', 'install QRbanner', 'QR manager app'],
  });
}

export default async function MobileAppsPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('mobileApps.title'),
          description: t('mobileApps.subtitle'),
          path: '/apps',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('mobileApps.breadcrumb'), href: '/apps' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <MobileAppsPageContent />
        </div>
      </div>
    </>
  );
}
