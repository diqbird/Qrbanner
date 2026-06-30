import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { ArrowRight } from 'lucide-react';

import { SOLUTION_PAGES } from '@/lib/solutions';

import { solutionIcon } from '@/lib/solution-icons';

import { pageMetadata, webPageJsonLd } from '@/lib/seo';

import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';

import { JsonLd } from '@/components/seo/json-ld';

import { getServerLocale } from '@/lib/i18n/server';

import { translate } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('solutionsIndex.metaTitle'),
    description: t('solutionsIndex.metaDescription'),
    path: '/solutions',
    keywords: ['QR code solutions', 'restaurant QR', 'retail QR', 'hotel QR', 'agency QR'],
  });
}

export default async function SolutionsIndexPage() {

  const locale = await getServerLocale();

  const t = (key: string) => translate(locale, key);



  return (

    <>

      <JsonLd
        data={webPageJsonLd({
          title: t('solutionsIndex.title'),
          description: t('solutionsIndex.subtitle'),
          path: '/solutions',
        })}
      />

      <PublicBreadcrumbs items={[{ label: t('nav.solutions'), href: '/solutions' }]} />

      <div className="py-10 sm:py-16">

        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">

          <header className="mx-auto max-w-2xl text-center">

            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">

              {t('solutionsIndex.title')}

            </h1>

            <p className="mt-4 text-lg text-muted-foreground">{t('solutionsIndex.subtitle')}</p>

          </header>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {SOLUTION_PAGES.map((s) => {

              const Icon = solutionIcon(s.icon);

              return (

                <Link

                  key={s.slug}

                  href={`/solutions/${s.slug}`}

                  className="group flex flex-col rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"

                >

                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">

                    <Icon className="h-5 w-5" aria-hidden />

                  </div>

                  <h2 className="font-display text-lg font-semibold">{s.title}</h2>

                  <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">{s.description}</p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">

                    {t('solutionsIndex.learnMore')} <ArrowRight className="h-4 w-4" />

                  </span>

                </Link>

              );

            })}

          </div>

          <div className="mt-12 text-center">

            <Link href="/qr/create?quick=1">

              <Button size="lg" className="gap-2 rounded-full">

                {t('solutionsIndex.cta')} <ArrowRight className="h-4 w-4" />

              </Button>

            </Link>

          </div>

        </div>

      </div>

    </>

  );

}


