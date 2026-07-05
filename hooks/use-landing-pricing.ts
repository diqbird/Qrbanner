'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/components/i18n/language-provider';
import { usePlanCheckout } from '@/hooks/use-plan-checkout';
import type { BillingInterval, PlanId } from '@/lib/plans';

export function useLandingPricing() {
  const { t, locale } = useLanguage();
  const { data: session } = useSession() || {};
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { checkoutPlan, loadingPlan, billingConfigured, annualAvailable, billingLoading } = usePlanCheckout();

  const handlePlanClick = async (planId: PlanId, priceMonthly: number | null) => {
    const result = await checkoutPlan(planId, priceMonthly, interval, {
      signInCallbackUrl: '/pricing',
      isSignedIn: Boolean(session),
    });
    if (result.redirected && result.href) {
      window.location.href = result.href;
    }
  };

  return {
    t,
    locale,
    interval,
    setInterval,
    ref,
    inView,
    loadingPlan,
    billingConfigured,
    annualAvailable,
    billingLoading,
    handlePlanClick,
  };
}

export type LandingPricingState = ReturnType<typeof useLandingPricing>;
