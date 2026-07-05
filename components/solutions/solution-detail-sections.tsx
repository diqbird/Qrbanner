'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { SolutionPage } from '@/lib/solutions';
import { useLanguage } from '@/components/i18n/language-provider';
import { freePlanQrLimit } from '@/lib/plans';
import { SolutionDetailBenefits, SolutionDetailFeatures } from './solution-detail-benefits-features';
import { SolutionDetailSteps, SolutionDetailFaq } from './solution-detail-steps-faq';

export function SolutionDetailBody({ solution }: { solution: SolutionPage }) {
  return (
    <>
      <SolutionDetailBenefits solution={solution} />
      <SolutionDetailFeatures solution={solution} />
      <SolutionDetailSteps solution={solution} />
      <SolutionDetailFaq solution={solution} />
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
