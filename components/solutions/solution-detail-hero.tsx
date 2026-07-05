'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { solutionIcon } from '@/lib/solution-icons';
import type { SolutionPage } from '@/lib/solutions';
import { demoBookingUrl } from '@/lib/site-contact';
import { useLanguage } from '@/components/i18n/language-provider';

export function SolutionDetailHero({ solution }: { solution: SolutionPage }) {
  const { t } = useLanguage();
  const Icon = solutionIcon(solution.icon);
  const createUrl = solution.templateId
    ? `/qr/create?template=${solution.templateId}`
    : solution.categoryId
      ? `/qr/create?category=${solution.categoryId}`
      : '/qr/create';
  const demoUrl = demoBookingUrl();

  return (
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
  );
}
