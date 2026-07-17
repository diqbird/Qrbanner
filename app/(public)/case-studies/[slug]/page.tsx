import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getCaseStudy, CASE_STUDIES } from '@/lib/case-studies';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { localizeCaseStudyView } from '@/lib/i18n/case-study-localize';

export const revalidate = 3600;

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const study = getCaseStudy(params.slug);
  if (!study) return {};
  const locale = await getServerLocale();
  const view = localizeCaseStudyView(study, locale);
  return pageMetadata({
    locale,
    title: view.title,
    description: view.metaDescription,
    path: `/case-studies/${study.slug}`,
  });
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = getCaseStudy(params.slug);
  if (!study) notFound();

  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const view = localizeCaseStudyView(study, locale);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: view.title,
          description: view.metaDescription,
          path: `/case-studies/${study.slug}`,
          locale,
        })}
      />
      <PremiumPageFrame narrow="3xl">
        <PublicBreadcrumbs
        items={[
        { label: t('nav.caseStudies'), href: '/case-studies' },
        { label: view.title, href: `/case-studies/${study.slug}` },
        ]}
        />
        <article>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">{view.industry}</p>
          <p className="mt-3 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-800 dark:text-amber-200">
            {t('caseStudyPage.scenarioBadge')}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{view.headline}</h1>
          <p className="mt-2 text-muted-foreground">{view.companyType}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {view.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-border/50 bg-card p-4 text-center">
                <p className="font-display text-2xl font-bold text-primary">{m.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>

          <section className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">{t('caseStudyPage.challenge')}</h2>
              <p className="mt-2">{view.challenge}</p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">{t('caseStudyPage.solution')}</h2>
              <p className="mt-2">{view.solution}</p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">{t('caseStudyPage.results')}</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {view.results.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </section>

          <blockquote className="mt-12 border-l-4 border-primary pl-4 italic text-foreground">
            &ldquo;{view.quote}&rdquo;
            <footer className="mt-2 text-sm not-italic text-muted-foreground">— {view.quoteRole}</footer>
          </blockquote>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link href="/qr/create?quick=1">
              <Button className="gap-2 rounded-full">
                {t('caseStudyPage.ctaCreate')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/roi-calculator">
              <Button variant="outline" className="rounded-full">
                {t('caseStudyPage.ctaRoi')}
              </Button>
            </Link>
          </div>
        </article>
      </PremiumPageFrame>
    </>
  );
}
