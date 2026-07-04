/** Paid plan checkout is closed until Stripe/Paddle env is configured. */
export function isPaidPlan(priceMonthly: number | null | undefined): boolean {
  return priceMonthly !== null && priceMonthly !== undefined && priceMonthly > 0;
}

export function isPaidCheckoutClosed(
  priceMonthly: number | null | undefined,
  billingConfigured: boolean,
  billingLoading: boolean
): boolean {
  return isPaidPlan(priceMonthly) && !billingLoading && !billingConfigured;
}

export function earlyAccessContactHref(planId: string): string {
  return `/contact?early=1&plan=${encodeURIComponent(planId)}`;
}

export function planCardPriceLabel(
  priceLabel: string,
  priceMonthly: number | null | undefined,
  billingConfigured: boolean,
  billingLoading: boolean,
  t: (key: string) => string
): string {
  if (isPaidCheckoutClosed(priceMonthly, billingConfigured, billingLoading)) {
    return t('pricing.contactForPricing');
  }
  return priceLabel;
}
