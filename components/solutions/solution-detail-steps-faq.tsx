'use client';

import { HelpCircle } from 'lucide-react';
import type { SolutionPage } from '@/lib/solutions';
import { useLanguage } from '@/components/i18n/language-provider';

export function SolutionDetailSteps({ solution }: { solution: SolutionPage }) {
  const { t } = useLanguage();

  return (
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
  );
}

export function SolutionDetailFaq({ solution }: { solution: SolutionPage }) {
  const { t } = useLanguage();

  if (solution.faq.length === 0) return null;

  return (
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
  );
}
