import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getCaseStudy, CASE_STUDIES } from '@/lib/case-studies';
import { pageMetadata } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const study = getCaseStudy(params.slug);
  if (!study) return {};
  const locale = await getServerLocale();
  return pageMetadata({
    locale,
    title: study.title,
    description: study.metaDescription,
    path: `/case-studies/${study.slug}`,
  });
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = getCaseStudy(params.slug);
  if (!study) notFound();

  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <PublicBreadcrumbs
        items={[
          { label: t('nav.caseStudies'), href: '/case-studies' },
          { label: study.title, href: `/case-studies/${study.slug}` },
        ]}
      />
      <article className="py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">{study.industry}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{study.headline}</h1>
          <p className="mt-2 text-muted-foreground">{study.companyType}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {study.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-border/50 bg-card p-4 text-center">
                <p className="font-display text-2xl font-bold text-primary">{m.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>

          <section className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">{t('caseStudyPage.challenge')}</h2>
              <p className="mt-2">{study.challenge}</p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">{t('caseStudyPage.solution')}</h2>
              <p className="mt-2">{study.solution}</p>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">{t('caseStudyPage.results')}</h2>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {study.results.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </section>

          <blockquote className="mt-12 border-l-4 border-primary pl-4 italic text-foreground">
            &ldquo;{study.quote}&rdquo;
            <footer className="mt-2 text-sm not-italic text-muted-foreground">— {study.quoteRole}</footer>
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
        </div>
      </article>
    </>
  );
}
