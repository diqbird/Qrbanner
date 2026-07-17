import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { HelpPageContent } from '@/components/public/help-page-content';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('help.metaTitle'),
    description: t('help.metaDescription'),
    path: '/help',
  });
}

export default async function HelpPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const pageTitle = t('help.metaTitle');
  const pageDesc = t('help.metaDescription');

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: pageTitle,
          description: pageDesc,
          path: '/help',
          locale,
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('nav.help'), href: '/help' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <HelpPageContent />
        </div>
      </div>
    </>
  );
}
