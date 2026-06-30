'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { solutionIcon } from '@/lib/solution-icons';
import type { SolutionPage } from '@/lib/solutions';
import { demoBookingUrl } from '@/lib/site-contact';
import { useLanguage } from '@/components/i18n/language-provider';

export function SolutionDetailShell({ solution }: { solution: SolutionPage }) {
  const { t } = useLanguage();
  const Icon = solutionIcon(solution.icon);
  const createUrl = solution.templateId
    ? `/qr/create?template=${solution.templateId}`
    : solution.categoryId
      ? `/qr/create?category=${solution.categoryId}`
      : '/qr/create';
  const demoUrl = demoBookingUrl();

  return (
    <>
      <PublicBreadcrumbs
        items={[
          { label: t('nav.solutions'), href: '/solutions' },
          { label: solution.title, href: `/solutions/${solution.slug}` },
        ]}
      />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <header className="text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-7 w-7" aria-hidden />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{solution.headline}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{solution.description}</p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href={createUrl} data-testid="solution-create-cta">
                <Button size="lg" className="gap-2 rounded-full px-8">
                  {t('solutionDetail.createFree')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={demoUrl}>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  {t('solutionDetail.bookDemo')}
                </Button>
              </Link>
            </div>
          </header>

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

          <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="font-display text-xl font-semibold">{t('solutionDetail.ctaTitle')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('solutionDetail.ctaBody')}</p>
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
        </div>
      </div>
    </>
  );
}
