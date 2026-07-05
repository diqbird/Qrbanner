import { siteBaseUrl } from '@/lib/billing-provider';

/** Paid marketplace seller payouts — Paddle seller onboarding not yet implemented. */
export function isMarketplacePayoutConfigured(): boolean {
  return false;
}

export async function refreshConnectStatus(_userId: string): Promise<void> {
  // No-op until Paddle seller payouts are wired.
}

export async function createConnectOnboardingLink(
  _userId: string,
  _email: string,
): Promise<{ url: string } | { fallback: string }> {
  return { fallback: 'payouts_not_available' };
}

export async function createListingCheckoutSession(_params: {
  listingId: string;
  buyerId: string;
  buyerEmail: string;
  amountCents: number;
  currency: string;
  platformFeeCents: number;
  title: string;
}): Promise<{ url: string } | { fallback: string }> {
  return { fallback: 'payouts_not_available' };
}

export { siteBaseUrl };
