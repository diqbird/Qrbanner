import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { ArrowRight, BarChart3 } from 'lucide-react';

import { pageMetadata, webPageJsonLd } from '@/lib/seo';

import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';

import { JsonLd } from '@/components/seo/json-ld';

import { CASE_STUDIES } from '@/lib/case-studies';

import { getServerLocale } from '@/lib/i18n/server';

import { translate } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('caseStudiesIndex.metaTitle'),
    description: t('caseStudiesIndex.metaDescription'),
    path: '/case-studies',
  });
}

export default async function CaseStudiesIndexPage() {

  const locale = await getServerLocale();

  const t = (key: string) => translate(locale, key);



  return (

    <>

      <JsonLd

        data={webPageJsonLd({

          title: t('caseStudiesIndex.title'),

          description: t('caseStudiesIndex.subtitle'),

          path: '/case-studies',

        })}

      />

      <PublicBreadcrumbs items={[{ label: t('nav.caseStudies'), href: '/case-studies' }]} />

      <div className="py-10 sm:py-16">

        <div className="mx-auto max-w-4xl px-4 sm:px-6">

          <header className="text-center">

            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">

              {t('caseStudiesIndex.title')}

            </h1>

            <p className="mt-4 text-lg text-muted-foreground">{t('caseStudiesIndex.subtitle')}</p>

          </header>

          <div className="mt-12 space-y-6">

            {CASE_STUDIES.map((study) => (

              <article

                key={study.slug}

                className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm"

              >

                <p className="text-xs font-medium uppercase tracking-wider text-primary">{study.industry}</p>

                <h2 className="mt-2 font-display text-2xl font-bold">{study.headline}</h2>

                <p className="mt-2 text-sm text-muted-foreground">{study.companyType}</p>

                <div className="mt-4 flex flex-wrap gap-4">

                  {study.metrics.slice(0, 2).map((m) => (

                    <div key={m.label} className="flex items-center gap-2 text-sm">

                      <BarChart3 className="h-4 w-4 text-primary" aria-hidden />

                      <span className="font-semibold">{m.value}</span>

                      <span className="text-muted-foreground">{m.label}</span>

                    </div>

                  ))}

                </div>

                <Link href={`/case-studies/${study.slug}`} className="mt-6 inline-block">

                  <Button variant="outline" className="gap-2">

                    {t('caseStudiesIndex.readStudy')} <ArrowRight className="h-4 w-4" />

                  </Button>

                </Link>

              </article>

            ))}

          </div>

        </div>

      </div>

    </>

  );

}


