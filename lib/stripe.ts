import Stripe from 'stripe';
import type { BillingInterval, PlanId } from '@/lib/plans';

let stripeClient: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_PRICE_PRO &&
      process.env.STRIPE_PRICE_BUSINESS
  );
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function stripePriceIdForPlan(plan: PlanId, interval: BillingInterval = 'monthly'): string | null {
  if (plan === 'pro') {
    if (interval === 'annual') return process.env.STRIPE_PRICE_PRO_ANNUAL ?? null;
    return process.env.STRIPE_PRICE_PRO ?? null;
  }
  if (plan === 'business') {
    if (interval === 'annual') return process.env.STRIPE_PRICE_BUSINESS_ANNUAL ?? null;
    return process.env.STRIPE_PRICE_BUSINESS ?? null;
  }
  if (plan === 'agency') {
    if (interval === 'annual') return process.env.STRIPE_PRICE_AGENCY_ANNUAL ?? null;
    return process.env.STRIPE_PRICE_AGENCY ?? null;
  }
  return null;
}

export function planIdFromStripePrice(priceId: string): PlanId | null {
  const proPrices = [process.env.STRIPE_PRICE_PRO, process.env.STRIPE_PRICE_PRO_ANNUAL].filter(Boolean);
  const businessPrices = [process.env.STRIPE_PRICE_BUSINESS, process.env.STRIPE_PRICE_BUSINESS_ANNUAL].filter(Boolean);
  const agencyPrices = [process.env.STRIPE_PRICE_AGENCY, process.env.STRIPE_PRICE_AGENCY_ANNUAL].filter(Boolean);
  if (proPrices.includes(priceId)) return 'pro';
  if (businessPrices.includes(priceId)) return 'business';
  if (agencyPrices.includes(priceId)) return 'agency';
  return null;
}

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    'https://qrbanner.com'
  ).replace(/\/$/, '');
}
