'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import type { SolutionPage } from '@/lib/solutions';
import { useLanguage } from '@/components/i18n/language-provider';
import { freePlanQrLimit } from '@/lib/plans';

export function SolutionDetailBody({ solution }: { solution: SolutionPage }) {
  const { t } = useLanguage();

  return (
    <>
      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold">{t('solutionDetail.whyQrbanner')}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {solution.benefits.map((b) => (
            <li key={b} className="flex gap-3 rounded-xl border border-border/50 bg-card/60 p-4 text-sm text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              {b}
            </li>
          ))}
        </ul>
      </section>

      {solution.features.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">
            {t('solutionDetail.platformFeatures', { title: solution.title.toLowerCase() })}
          </h2>
          <ul className="mt-4 space-y-2">
            {solution.features.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold">{t('solutionDetail.howItWorks')}</h2>
        <ol className="mt-4 space-y-4">
          {solution.steps.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-border/50 bg-card/80 p-5">
              <p className="text-xs font-medium text-primary">{t('solutionDetail.step', { n: i + 1 })}</p>
              <p className="mt-1 font-medium">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {solution.faq.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {t('solutionDetail.faq')}
          </h2>
          <dl className="mt-4 space-y-4">
            {solution.faq.map((item) => (
              <div key={item.q} className="rounded-xl border border-border/50 bg-card/60 p-5">
                <dt className="font-medium">{item.q}</dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </>
  );
}

export function SolutionDetailCta({ solution }: { solution: SolutionPage }) {
  const { t } = useLanguage();
  const createUrl = solution.templateId
    ? `/qr/create?template=${solution.templateId}`
    : solution.categoryId
      ? `/qr/create?category=${solution.categoryId}`
      : '/qr/create';

  return (
    <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
      <h2 className="font-display text-xl font-semibold">{t('solutionDetail.ctaTitle')}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{t('solutionDetail.ctaBody', { count: freePlanQrLimit() })}</p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href={createUrl}>
          <Button className="gap-2 rounded-full">
            {t('solutionDetail.startWith', { title: solution.title })} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/roi-calculator">
          <Button variant="outline" className="rounded-full">
            {t('solutionDetail.calculateRoi')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
