import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { USE_CASE_PAGES } from '@/lib/use-case-pages';
import { solutionIcon } from '@/lib/solution-icons';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
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

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('useCasesIndex.title'),
          description: t('useCasesIndex.subtitle'),
          path: '/use-cases',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('nav.useCases'), href: '/use-cases' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t('useCasesIndex.title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('useCasesIndex.subtitle')}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {t('useCasesIndex.alsoSee')}{' '}
              <Link href="/qr-types" className="text-primary hover:underline">
                {t('nav.qrTypes')}
              </Link>{' '}
              ·{' '}
              <Link href="/solutions" className="text-primary hover:underline">
                {t('nav.solutions')}
              </Link>
            </p>
          </header>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASE_PAGES.map((page) => {
              const Icon = solutionIcon(page.icon);
              return (
                <Link
                  key={page.slug}
                  href={`/use-cases/${page.slug}`}
                  className="group rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card/80"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-display font-semibold group-hover:text-primary line-clamp-2">
                        {page.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{page.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        {t('useCasesIndex.learnMore')} <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
