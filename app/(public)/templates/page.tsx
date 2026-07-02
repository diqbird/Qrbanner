import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateMarketplaceGrid } from '@/components/templates/template-marketplace-grid';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('templateMarketplace.metaTitle'),
    description: t('templateMarketplace.metaDescription'),
    path: '/templates',
    keywords: [
      'QR code templates',
      'restaurant menu QR template',
      'business card QR',
      'professional QR designs',
    ],
  });
}

export default async function TemplatesMarketplacePage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('templateMarketplace.title'),
          description: t('templateMarketplace.subtitle'),
          path: '/templates',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('nav.templates'), href: '/templates' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t('templateMarketplace.title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('templateMarketplace.subtitle')}</p>
          </header>
          <div className="mt-12">
            <TemplateMarketplaceGrid />
          </div>
          <div className="mt-12 text-center">
            <Link href="/solutions">
              <Button variant="outline" className="mr-3 rounded-full">
                {t('templateMarketplace.browseSolutions')}
              </Button>
            </Link>
            <Link href="/qr/create">
              <Button size="lg" className="gap-2 rounded-full">
                {t('templateMarketplace.cta')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
