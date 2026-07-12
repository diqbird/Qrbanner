import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { localizeCaseStudyView } from '@/lib/i18n/case-study-localize';
import { CASE_STUDIES } from '@/lib/case-studies';
import { Button } from '@/components/ui/button';

export async function LandingCaseStudiesTeaser() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const featured = CASE_STUDIES.slice(0, 3);

  return (
    <section className="cv-auto border-y border-border/40 bg-muted/10 py-14 sm:py-16" aria-labelledby="case-studies-teaser">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="case-studies-teaser" className="font-display text-2xl font-bold sm:text-3xl">
              {t('caseStudiesTeaser.title')}
            </h2>
            <p className="mt-2 text-muted-foreground">{t('caseStudiesTeaser.subtitle')}</p>
          </div>
          <Link href="/case-studies">
            <Button variant="outline" className="gap-2">
              {t('caseStudiesTeaser.viewAll')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((study) => {
            const view = localizeCaseStudyView(study, locale);
            return (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-colors hover:border-primary/30"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-primary">{view.industry}</p>
              <h3 className="mt-2 font-display font-semibold leading-snug">{view.headline}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{view.challenge}</p>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
