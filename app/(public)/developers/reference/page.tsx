import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { SwaggerExplorer } from '@/components/developers/swagger-explorer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileJson } from 'lucide-react';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('developersReference.metaTitle'),
    description: t('developersReference.metaDescription'),
    path: '/developers/reference',
    keywords: ['QRbanner OpenAPI', 'QR API reference', 'Swagger', 'REST API docs'],
  });
}

export default async function DevelopersReferencePage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('developersReference.title'),
          description: t('developersReference.subtitle'),
          path: '/developers/reference',
          locale,
        })}
      />
      <PublicBreadcrumbs
        items={[
          { label: t('nav.api'), href: '/developers' },
          { label: t('developersReference.title'), href: '/developers/reference' },
        ]}
      />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {t('developersReference.title')}
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">{t('developersReference.subtitle')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/developers">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> {t('developersReference.back')}
                </Button>
              </Link>
              <Link href="/api/openapi.json" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="gap-2">
                  <FileJson className="h-4 w-4" /> {t('developersPage.openapiLink')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
            <SwaggerExplorer
              loadingLabel={t('developersReference.loading')}
              errorLabel={t('developersReference.error')}
            />
          </div>
        </div>
      </div>
    </>
  );
}
