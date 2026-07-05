'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { useBillingStatus } from '@/hooks/use-billing-status';
import type { PublicBillingStatus } from '@/lib/public-billing-status';
import {
  resolveFreeOrEarlyAccessCheckout,
  runPlanCheckout,
  type CheckoutResult,
} from '@/lib/plan-checkout-api';
import type { BillingInterval, PlanId } from '@/lib/plans';

export function usePlanCheckout(initialBillingStatus?: PublicBillingStatus | null) {
  const { t } = useLanguage();
  const { configured: billingConfigured, annualAvailable, loading: billingLoading, provider } =
    useBillingStatus(initialBillingStatus);
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  const checkoutPlan = async (
    planId: PlanId,
    priceMonthly: number | null,
    interval: BillingInterval,
    options?: { signInCallbackUrl?: string; isSignedIn?: boolean },
  ): Promise<CheckoutResult> => {
    const early = resolveFreeOrEarlyAccessCheckout(
      priceMonthly,
      billingConfigured,
      planId,
      options?.isSignedIn,
    );
    if (early) return early;

    setLoadingPlan(planId);
    try {
      return await runPlanCheckout({
        planId,
        priceMonthly,
        interval,
        provider,
        t,
        signInCallbackUrl: options?.signInCallbackUrl,
        isSignedIn: options?.isSignedIn,
      });
    } catch {
      toast.error(t('auth.somethingWrong'));
      return { error: true as const };
    } finally {
      setLoadingPlan(null);
    }
  };

  return {
    checkoutPlan,
    loadingPlan,
    billingConfigured,
    annualAvailable,
    billingLoading,
  };
}
