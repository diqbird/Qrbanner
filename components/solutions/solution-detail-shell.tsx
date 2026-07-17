'use client';

import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import type { SolutionPage } from '@/lib/solutions';
import { useLanguage } from '@/components/i18n/language-provider';
import { SolutionDetailHero } from './solution-detail-hero';
import { SolutionDetailBody, SolutionDetailCta } from './solution-detail-sections';

export function SolutionDetailShell({ solution }: { solution: SolutionPage }) {
  const { t } = useLanguage();

  return (
    <PremiumPageFrame narrow="4xl">
      <PublicBreadcrumbs
        items={[
          { label: t('nav.solutions'), href: '/solutions' },
          { label: solution.title, href: `/solutions/${solution.slug}` },
        ]}
      />
      <SolutionDetailHero solution={solution} />
      <SolutionDetailBody solution={solution} />
      <SolutionDetailCta solution={solution} />
    </PremiumPageFrame>
  );
}
