'use client';

import { CheckCircle2 } from 'lucide-react';
import type { SolutionPage } from '@/lib/solutions';
import { useLanguage } from '@/components/i18n/language-provider';

export function SolutionDetailBenefits({ solution }: { solution: SolutionPage }) {
  const { t } = useLanguage();

  return (
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
  );
}

export function SolutionDetailFeatures({ solution }: { solution: SolutionPage }) {
  const { t } = useLanguage();

  if (solution.features.length === 0) return null;

  return (
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
  );
}
