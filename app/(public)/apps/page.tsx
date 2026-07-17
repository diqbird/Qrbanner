import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd, faqJsonLd, howToJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
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

  const faqItems = [
    { question: t('mobileApps.faqPwaQ'), answer: t('mobileApps.faqPwaA') },
    { question: t('mobileApps.faqInstallQ'), answer: t('mobileApps.faqInstallA') },
    { question: t('mobileApps.faqApiQ'), answer: t('mobileApps.faqApiA') },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            title: t('mobileApps.title'),
            description: t('mobileApps.subtitle'),
            path: '/apps',
            locale,
          }),
          faqJsonLd(faqItems),
          howToJsonLd({
            name: t('mobileApps.howToName'),
            description: t('mobileApps.howToDesc'),
            locale,
            path: '/apps',
            steps: [
              { name: t('mobileApps.howToStep1Name'), text: t('mobileApps.howToStep1Text') },
              { name: t('mobileApps.howToStep2Name'), text: t('mobileApps.howToStep2Text') },
              { name: t('mobileApps.howToStep3Name'), text: t('mobileApps.howToStep3Text') },
            ],
          }),
        ]}
      />
      <PremiumPageFrame narrow="4xl">
        <PublicBreadcrumbs items={[{ label: t('mobileApps.breadcrumb'), href: '/apps' }]} />
          <MobileAppsPageContent faqItems={faqItems} faqTitle={t('mobileApps.faqTitle')} />
      </PremiumPageFrame>
    </>
  );
}
