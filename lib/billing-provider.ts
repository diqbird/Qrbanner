import { isPaddleConfigured } from '@/lib/paddle';
import { isStripeConfigured } from '@/lib/stripe';

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

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    'https://qrbanner.com'
  ).replace(/\/$/, '');
}
