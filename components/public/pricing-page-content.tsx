'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { usePricingPage } from '@/hooks/use-pricing-page';
import { PricingPageHero, PricingPlanGrid } from './pricing-plan-section';
import { PricingComparisonTable } from './pricing-comparison-table';
import { PricingTrustBar } from './pricing-trust-bar';
import { PricingFaq } from './pricing-faq';
import { EnterpriseCtaBand } from '@/components/marketing/enterprise-cta-band';
import { PricingReferralBanner } from '@/components/marketing/pricing-referral-banner';
import { Reveal } from '@/components/landing/premium/primitives';
import type { PublicBillingStatus } from '@/lib/public-billing-status';

type PricingPageContentProps = {
  initialBillingStatus?: PublicBillingStatus | null;
};

export function PricingPageContent({ initialBillingStatus = null }: PricingPageContentProps) {
  const pricing = usePricingPage(initialBillingStatus);
  const { t } = pricing;

  return (
    <>
      <PricingPageHero pricing={pricing} />
      <PricingReferralBanner />
      <PricingPlanGrid pricing={pricing} />
      <PricingTrustBar />
      <PricingComparisonTable pricing={pricing} />
      <PricingFaq />
      <EnterpriseCtaBand />
      <Reveal className="mt-14 text-center sm:mt-16">
        <Link href="/signup" className="ph-btn-primary">
          {t('pricing.createAccount')} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Reveal>
    </>
  );
}
