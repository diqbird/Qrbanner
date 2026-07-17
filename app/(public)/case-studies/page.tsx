import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { localizeCaseStudyView } from '@/lib/i18n/case-study-localize';
import { CASE_STUDIES } from '@/lib/case-studies';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
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
          locale,
        })}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <div className="mx-auto max-w-4xl">
            <PublicBreadcrumbs items={[{ label: t('nav.caseStudies'), href: '/case-studies' }]} />
            <header className="relative text-center">
              <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
                <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
              </div>
              <p className="ph-eyebrow mb-4">{t('nav.caseStudies')}</p>
              <h1 className="ph-title text-4xl leading-[1.1] sm:text-5xl">{t('caseStudiesIndex.title')}</h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('caseStudiesIndex.subtitle')}</p>
              <p className="ph-card mx-auto mt-4 max-w-2xl px-4 py-3 text-sm text-muted-foreground hover:translate-y-0 hover:scale-100">
                {t('caseStudyPage.scenarioBadge')}
              </p>
            </header>

            <div className="mt-12 space-y-5">
              {CASE_STUDIES.map((study) => {
                const view = localizeCaseStudyView(study, locale);
                return (
                  <article key={study.slug} className="ph-card p-6 hover:translate-y-0 hover:scale-100 sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB] dark:text-sky-400">
                      {view.industry}
                    </p>
                    <h2 className="ph-title mt-2 text-2xl">{view.headline}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{view.companyType}</p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      {view.metrics.slice(0, 2).map((m) => (
                        <div key={m.label} className="flex items-center gap-2 text-sm">
                          <BarChart3 className="h-4 w-4 text-[#2563EB] dark:text-sky-400" aria-hidden />
                          <span className="font-semibold">{m.value}</span>
                          <span className="text-muted-foreground">{m.label}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={localizePath(`/case-studies/${study.slug}`, locale)}
                      className="ph-btn-secondary mt-6"
                    >
                      {t('caseStudiesIndex.readStudy')} <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </PremiumShell>
    </>
  );
}
