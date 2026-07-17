import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SOLUTION_PAGES } from '@/lib/solutions';
import { solutionIcon } from '@/lib/solution-icons';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { localizeSolutionPage } from '@/lib/i18n/solution-localize';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('solutionsIndex.metaTitle'),
    description: t('solutionsIndex.metaDescription'),
    path: '/solutions',
    keywords: ['QR code solutions', 'restaurant QR', 'retail QR', 'hotel QR', 'agency QR'],
  });
}

export default async function SolutionsIndexPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const pages = SOLUTION_PAGES.map((s) => localizeSolutionPage(s, locale));

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('solutionsIndex.title'),
          description: t('solutionsIndex.subtitle'),
          path: '/solutions',
          locale,
        })}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <PublicBreadcrumbs items={[{ label: t('nav.solutions'), href: '/solutions' }]} />
          <header className="relative mx-auto max-w-2xl text-center">
            <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
              <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
            </div>
            <p className="ph-eyebrow mb-4">{t('nav.solutions')}</p>
            <h1 className="ph-title text-4xl leading-[1.1] sm:text-5xl">{t('solutionsIndex.title')}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('solutionsIndex.subtitle')}</p>
          </header>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {pages.map((s) => {
              const Icon = solutionIcon(s.icon);
              return (
                <Link
                  key={s.slug}
                  href={localizePath(`/solutions/${s.slug}`, locale)}
                  className="ph-card group flex flex-col p-6"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB] transition-colors group-hover:bg-[#2563EB] group-hover:text-white dark:bg-sky-400/15 dark:text-sky-400 dark:group-hover:bg-sky-400 dark:group-hover:text-slate-950">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h2 className="ph-title text-lg">{s.title}</h2>
                  <p className="mt-2 flex-1 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] dark:text-sky-400">
                    {t('solutionsIndex.learnMore')} <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/qr/create?quick=1" prefetch={false} className="ph-btn-primary">
              {t('solutionsIndex.cta')} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </PremiumShell>
    </>
  );
}
