import { isPaddleConfigured, paddlePriceIdForPlan } from '@/lib/paddle';
import type { PlanId } from '@/lib/plans';

export type BillingProvider = 'paddle';

export function activeBillingProvider(): BillingProvider | null {
  if (isPaddleConfigured()) return 'paddle';
  return null;
}

export function isBillingConfigured(): boolean {
  return activeBillingProvider() !== null;
}

/** True when paid-plan annual price IDs exist for Paddle. */
export function isAnnualBillingConfigured(): boolean {
  if (!isPaddleConfigured()) return false;
  const plans: PlanId[] = ['pro', 'business', 'agency'];
  return plans.every((plan) => Boolean(paddlePriceIdForPlan(plan, 'annual')));
}

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    'https://qrbanner.com'
  ).replace(/\/$/, '');
}
