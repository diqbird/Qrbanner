import { isPaddleConfigured, paddlePriceIdForPlan } from '@/lib/paddle';
import { isStripeConfigured, stripePriceIdForPlan } from '@/lib/stripe';
import type { PlanId } from '@/lib/plans';

export type BillingProvider = 'paddle' | 'stripe';

/** Paddle is preferred when both are configured. */
export function activeBillingProvider(): BillingProvider | null {
  if (isPaddleConfigured()) return 'paddle';
  if (isStripeConfigured()) return 'stripe';
  return null;
}

export function isBillingConfigured(): boolean {
  return activeBillingProvider() !== null;
}

/** True when paid-plan annual price IDs exist for the active billing provider. */
export function isAnnualBillingConfigured(): boolean {
  const provider = activeBillingProvider();
  if (!provider) return false;
  const plans: PlanId[] = ['pro', 'business', 'agency'];
  return plans.every((plan) => {
    const priceId =
      provider === 'paddle'
        ? paddlePriceIdForPlan(plan, 'annual')
        : stripePriceIdForPlan(plan, 'annual');
    return Boolean(priceId);
  });
}

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    'https://qrbanner.com'
  ).replace(/\/$/, '');
}
