'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { useBillingStatus } from '@/hooks/use-billing-status';
import type { PublicBillingStatus } from '@/lib/public-billing-status';
import { openPaddleCheckout, openPaddleCheckoutFromUrl } from '@/lib/paddle-client';
import type { BillingInterval, PlanId } from '@/lib/plans';
import { earlyAccessContactHref } from '@/lib/pricing-display';

type CheckoutResponse = {
  url?: string;
  transactionId?: string;
  error?: string;
  manageBilling?: boolean;
};

export function usePlanCheckout(initialBillingStatus?: PublicBillingStatus | null) {
  const { t } = useLanguage();
  const { configured: billingConfigured, annualAvailable, loading: billingLoading, provider } =
    useBillingStatus(initialBillingStatus);
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  const checkoutPlan = async (
    planId: PlanId,
    priceMonthly: number | null,
    interval: BillingInterval,
    options?: { signInCallbackUrl?: string; isSignedIn?: boolean }
  ) => {
    if (priceMonthly === 0 || priceMonthly === null) {
      return {
        redirected: true as const,
        href: options?.isSignedIn ? '/dashboard' : '/signup',
      };
    }

    if (!billingConfigured) {
      return { redirected: true as const, href: earlyAccessContactHref(planId) };
    }

    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, interval }),
      });

      if (res.status === 401) {
        const callback = options?.signInCallbackUrl ?? '/pricing';
        return { redirected: true as const, href: `/login?callbackUrl=${encodeURIComponent(callback)}` };
      }

      const data = (await res.json()) as CheckoutResponse;

      if (provider === 'paddle') {
        if (data.transactionId) {
          try {
            await openPaddleCheckout(data.transactionId);
            return { opened: true as const };
          } catch (error) {
            const message = error instanceof Error ? error.message : '';
            if (message === 'paddle_client_token_missing') {
              toast.error(t('pricing.checkoutUnavailable'));
              return { error: true as const };
            }
            throw error;
          }
        }

        if (data.url) {
          const opened = await openPaddleCheckoutFromUrl(data.url);
          if (opened) return { opened: true as const };
        }
      }

      if (data?.url) {
        return { redirected: true as const, href: data.url };
      }

      if (res.status === 503 || data?.error === 'billing_not_configured') {
        toast.message(t('pricing.billingSoonToast'));
        return { error: true as const };
      }

      if (!res.ok) {
        if (data?.manageBilling) {
          toast.message(t('billing.alreadyOnPlan'));
          const portal = await fetch('/api/billing/portal', { method: 'POST' });
          const portalData = await portal.json();
          if (portalData?.url) {
            return { redirected: true as const, href: portalData.url };
          }
        }
        toast.error(data?.error ?? t('auth.somethingWrong'));
        return { error: true as const };
      }

      return { error: true as const };
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
