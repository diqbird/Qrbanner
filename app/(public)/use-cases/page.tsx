import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { USE_CASE_PAGES } from '@/lib/use-case-pages';
import { localizeUseCasePage } from '@/lib/i18n/resolve-programmatic-copy';
import { solutionIcon } from '@/lib/solution-icons';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
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
    title: t('useCasesIndex.metaTitle'),
    description: t('useCasesIndex.metaDescription'),
    path: '/use-cases',
    keywords: [
      'QR code use cases',
      'marketing QR examples',
      'retail QR code',
      'event QR code',
      'packaging QR code',
    ],
  });
}

export default async function UseCasesIndexPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const pages = USE_CASE_PAGES.map((p) => localizeUseCasePage(p, locale));

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('useCasesIndex.title'),
          description: t('useCasesIndex.subtitle'),
          path: '/use-cases',
          locale,
        })}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <PublicBreadcrumbs items={[{ label: t('nav.useCases'), href: '/use-cases' }]} />
          <header className="relative mx-auto max-w-2xl text-center">
            <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
              <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
            </div>
            <p className="ph-eyebrow mb-4">{t('nav.useCases')}</p>
            <h1 className="ph-title text-4xl leading-[1.1] sm:text-5xl">{t('useCasesIndex.title')}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('useCasesIndex.subtitle')}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {t('useCasesIndex.alsoSee')}{' '}
              <Link
                href={localizePath('/qr-types', locale)}
                className="text-[#2563EB] underline underline-offset-2 hover:no-underline dark:text-sky-400"
              >
                {t('nav.qrTypes')}
              </Link>{' '}
              ·{' '}
              <Link
                href={localizePath('/solutions', locale)}
                className="text-[#2563EB] underline underline-offset-2 hover:no-underline dark:text-sky-400"
              >
                {t('nav.solutions')}
              </Link>
            </p>
          </header>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => {
              const source = USE_CASE_PAGES.find((p) => p.slug === page.slug) ?? page;
              const Icon = solutionIcon(source.icon);
              return (
                <Link
                  key={page.slug}
                  href={localizePath(`/use-cases/${page.slug}`, locale)}
                  className="ph-card group p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:bg-sky-400/15 dark:text-sky-400">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h2 className="ph-title line-clamp-2 text-base group-hover:text-[#2563EB] dark:group-hover:text-sky-400">
                        {page.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{page.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] dark:text-sky-400">
                        {t('useCasesIndex.learnMore')} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </PremiumShell>
    </>
  );
}
