import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { COMPETITOR_PAGES } from '@/lib/competitor-pages';
import { getPublicComparisonSummary, getPublicListTitle } from '@/lib/competitor-public';
import { pageMetadata, itemListJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';

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
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <div className="mx-auto max-w-[900px]">
            <PublicBreadcrumbs items={[{ label: t('nav.comparisons'), href: '/vs' }]} />
            <header className="relative text-center">
              <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
                <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
              </div>
              <p className="ph-eyebrow mb-4">{t('nav.comparisons')}</p>
              <h1 className="ph-title text-4xl leading-[1.1] sm:text-5xl">{t('vsIndex.title')}</h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('vsIndex.subtitle')}</p>
            </header>
            <ul className="mt-12 space-y-3">
              {COMPETITOR_PAGES.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={localizePath(`/vs/${p.slug}`, locale)}
                    className="ph-card group flex items-center justify-between p-5"
                  >
                    <div className="pr-4 text-left">
                      <h2 className="ph-title text-base group-hover:text-[#2563EB] dark:group-hover:text-sky-400">
                        {getPublicListTitle(p, locale)}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {getPublicComparisonSummary(p, locale)}
                      </p>
                    </div>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[#2563EB] dark:group-hover:text-sky-400"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PremiumShell>
    </>
  );
}
