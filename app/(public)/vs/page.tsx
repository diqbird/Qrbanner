import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { COMPETITOR_PAGES } from '@/lib/competitor-pages';
import { getPublicComparisonSummary, getPublicListTitle } from '@/lib/competitor-public';
import { pageMetadata, itemListJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('vsIndex.metaTitle'),
    description: t('vsIndex.metaDescription'),
    path: '/vs',
    keywords: ['QR code platform comparison', 'dynamic QR comparison', 'best QR code generator'],
  });
}

export default async function VsIndexPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          COMPETITOR_PAGES.map((p) => ({
            name: getPublicListTitle(p, locale),
            path: `/vs/${p.slug}`,
          }))
        )}
      />
      <PublicBreadcrumbs items={[{ label: t('nav.comparisons'), href: '/vs' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <header className="text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t('vsIndex.title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('vsIndex.subtitle')}</p>
          </header>
          <ul className="mt-12 space-y-4">
            {COMPETITOR_PAGES.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/vs/${p.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <div>
                    <h2 className="font-display font-semibold group-hover:text-primary">
                      {getPublicListTitle(p, locale)}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {getPublicComparisonSummary(p, locale)}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
