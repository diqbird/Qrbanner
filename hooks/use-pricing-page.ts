'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { usePlanCheckout } from '@/hooks/use-plan-checkout';
import type { BillingInterval, PlanId } from '@/lib/plans';
import type { PublicBillingStatus } from '@/lib/public-billing-status';

export function usePricingPage(initialBillingStatus: PublicBillingStatus | null = null) {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession() || {};
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  const [proTrialEligible, setProTrialEligible] = useState(false);
  const { checkoutPlan, loadingPlan, billingConfigured, annualAvailable, billingLoading } =
    usePlanCheckout(initialBillingStatus);

  useEffect(() => {
    if (searchParams.get('billing') === 'cancelled') {
      toast.message(t('pricing.billingCancelled'));
      router.replace('/pricing');
    }
  }, [searchParams, router, t]);

  useEffect(() => {
    if (!session?.user) {
      setProTrialEligible(false);
      return;
    }
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setProTrialEligible(Boolean(data?.trial?.eligible)))
      .catch(() => setProTrialEligible(false));
  }, [session?.user]);

  const handlePlanClick = async (planId: PlanId, priceMonthly: number | null) => {
    const result = await checkoutPlan(planId, priceMonthly, interval, {
      signInCallbackUrl: '/pricing',
      isSignedIn: Boolean(session),
    });
    if ('redirected' in result && result.href) {
      window.location.href = result.href;
    }
  };

  return {
    t,
    locale,
    interval,
    setInterval,
    loadingPlan,
    billingConfigured,
    annualAvailable,
    billingLoading,
    proTrialEligible,
    handlePlanClick,
  };
}

export type PricingPageState = ReturnType<typeof usePricingPage>;
