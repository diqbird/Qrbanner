import { PLANS, type PlanId } from '@/lib/plans';

export type AdminPlanCounts = Record<'free' | 'pro' | 'business' | 'agency', number>;

export function emptyPlanCounts(): AdminPlanCounts {
  return { free: 0, pro: 0, business: 0, agency: 0 };
}

export function planCountsFromGroupBy(
  rows: { plan: string; _count: { id: number } }[],
): AdminPlanCounts {
  const counts = emptyPlanCounts();
  for (const row of rows) {
    const key = row.plan as keyof AdminPlanCounts;
    if (key in counts) counts[key] = row._count.id;
  }
  return counts;
}

/** MRR from active Stripe subscriptions only (excludes manual admin plan assignments). */
export function estimatedMrr(planCounts: AdminPlanCounts): number {
  let mrr = 0;
  for (const id of ['pro', 'business', 'agency'] as PlanId[]) {
    const price = PLANS[id].priceMonthly;
    if (price) mrr += planCounts[id] * price;
  }
  return Math.round(mrr * 100) / 100;
}

export function premiumUserCount(planCounts: AdminPlanCounts): number {
  return planCounts.pro + planCounts.business + planCounts.agency;
}

export function billingStatusForUser(
  plan: string,
  stripeSubscriptionId: string | null,
): 'free' | 'stripe' | 'manual' {
  if (plan === 'free') return 'free';
  return stripeSubscriptionId ? 'stripe' : 'manual';
}
