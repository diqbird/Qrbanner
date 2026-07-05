import { toast } from 'sonner';
import { openPaddleCheckout, openPaddleCheckoutFromUrl } from '@/lib/paddle-client';
import type { BillingInterval, PlanId } from '@/lib/plans';
import { earlyAccessContactHref } from '@/lib/pricing-display';

type Translate = (key: string) => string;

export type CheckoutResponse = {
  url?: string;
  transactionId?: string;
  error?: string;
  manageBilling?: boolean;
};

export type CheckoutResult =
  | { redirected: true; href: string }
  | { opened: true }
  | { error: true };

export async function runPlanCheckout({
  planId,
  priceMonthly,
  interval,
  provider,
  t,
  signInCallbackUrl,
  isSignedIn,
}: {
  planId: PlanId;
  priceMonthly: number | null;
  interval: BillingInterval;
  provider: string | null | undefined;
  t: Translate;
  signInCallbackUrl?: string;
  isSignedIn?: boolean;
}): Promise<CheckoutResult> {
  if (priceMonthly === 0 || priceMonthly === null) {
    return { redirected: true, href: isSignedIn ? '/dashboard' : '/signup' };
  }

  const res = await fetch('/api/billing/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan: planId, interval }),
  });

  if (res.status === 401) {
    const callback = signInCallbackUrl ?? '/pricing';
    return { redirected: true, href: `/login?callbackUrl=${encodeURIComponent(callback)}` };
  }

  const data = (await res.json()) as CheckoutResponse;

  if (provider === 'paddle') {
    if (data.transactionId) {
      try {
        await openPaddleCheckout(data.transactionId);
        return { opened: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        if (message === 'paddle_client_token_missing') {
          toast.error(t('pricing.checkoutUnavailable'));
          return { error: true };
        }
        throw error;
      }
    }
    if (data.url) {
      const opened = await openPaddleCheckoutFromUrl(data.url);
      if (opened) return { opened: true };
    }
  }

  if (data?.url) {
    return { redirected: true, href: data.url };
  }

  if (res.status === 503 || data?.error === 'billing_not_configured') {
    toast.message(t('pricing.billingSoonToast'));
    return { error: true };
  }

  if (!res.ok) {
    if (data?.manageBilling) {
      toast.message(t('billing.alreadyOnPlan'));
      const portal = await fetch('/api/billing/portal', { method: 'POST' });
      const portalData = await portal.json();
      if (portalData?.url) {
        return { redirected: true, href: portalData.url };
      }
    }
    toast.error(data?.error ?? t('auth.somethingWrong'));
    return { error: true };
  }

  return { error: true };
}

export function resolveFreeOrEarlyAccessCheckout(
  priceMonthly: number | null,
  billingConfigured: boolean,
  planId: PlanId,
  isSignedIn?: boolean,
): CheckoutResult | null {
  if (priceMonthly === 0 || priceMonthly === null) {
    return { redirected: true, href: isSignedIn ? '/dashboard' : '/signup' };
  }
  if (!billingConfigured) {
    return { redirected: true, href: earlyAccessContactHref(planId) };
  }
  return null;
}
