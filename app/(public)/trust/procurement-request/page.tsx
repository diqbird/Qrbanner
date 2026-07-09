import type { Metadata } from 'next';
import { FileCheck } from 'lucide-react';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { ProcurementRequestForm } from '@/components/marketing/procurement-request-form';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('procurementRequest.metaTitle'),
    description: t('procurementRequest.metaDescription'),
    path: '/trust/procurement-request',
  });
}

export default async function ProcurementRequestPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('procurementRequest.title'),
          description: t('procurementRequest.subtitle'),
          path: '/trust/procurement-request',
        })}
      />
      <PublicBreadcrumbs
        items={[
          { label: t('nav.trust'), href: '/trust' },
          { label: t('nav.procurementRequest'), href: '/trust/procurement-request' },
        ]}
      />
      <div className="py-10 sm:py-16">
        <article className="mx-auto max-w-2xl space-y-8 px-4 sm:px-6">
          <header>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileCheck className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t('procurementRequest.title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('procurementRequest.subtitle')}</p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t('procurementRequest.disclaimer')}
            </p>
          </header>
          <ProcurementRequestForm />
        </article>
      </div>
    </>
  );
}
