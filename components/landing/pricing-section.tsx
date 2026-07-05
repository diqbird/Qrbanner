'use client';

import { useLandingPricing } from '@/hooks/use-landing-pricing';
import {
  LandingPricingHero,
  LandingPricingPlanGrid,
  LandingPricingComparison,
  LandingPricingEnterpriseBand,
} from './landing-pricing-sections';

export function LandingPricing() {
  const pricing = useLandingPricing();

  return (
    <section className="py-20 sm:py-28" ref={pricing.ref}>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <LandingPricingHero pricing={pricing} />
        <LandingPricingPlanGrid pricing={pricing} />
        <LandingPricingComparison pricing={pricing} />
        <LandingPricingEnterpriseBand pricing={pricing} />
      </div>
    </section>
  );
}
