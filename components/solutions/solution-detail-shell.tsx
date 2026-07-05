'use client';

import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import type { SolutionPage } from '@/lib/solutions';
import { useLanguage } from '@/components/i18n/language-provider';
import { SolutionDetailHero } from './solution-detail-hero';
import { SolutionDetailBody, SolutionDetailCta } from './solution-detail-sections';

export function SolutionDetailShell({ solution }: { solution: SolutionPage }) {
  const { t } = useLanguage();

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
          <SolutionDetailHero solution={solution} />
          <SolutionDetailBody solution={solution} />
          <SolutionDetailCta solution={solution} />
        </div>
      </div>
    </>
  );
}
