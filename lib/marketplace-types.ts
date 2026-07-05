export const MARKETPLACE_PLATFORM_FEE_PERCENT = 15;

/** Paid seller payouts (Paddle Connect) — free listings only until enabled. */
export const MARKETPLACE_PAID_SALES_ENABLED = false;

export const MARKETPLACE_LISTING_STATUSES = ['draft', 'published', 'archived'] as const;
export type MarketplaceListingStatus = (typeof MARKETPLACE_LISTING_STATUSES)[number];

export const MARKETPLACE_PURCHASE_STATUSES = ['pending', 'completed', 'failed', 'refunded'] as const;

export type MarketplaceListingInput = {
  title: string;
  description: string;
  priceCents: number;
  templateId?: string | null;
  category?: string | null;
  previewUrl?: string | null;
  status?: MarketplaceListingStatus;
};

export function splitMarketplaceFee(amountCents: number): {
  platformFeeCents: number;
  sellerNetCents: number;
} {
  const platformFeeCents = Math.round(amountCents * (MARKETPLACE_PLATFORM_FEE_PERCENT / 100));
  return {
    platformFeeCents,
    sellerNetCents: Math.max(0, amountCents - platformFeeCents),
  };
}

export function formatListingPrice(priceCents: number, currency = 'usd'): string {
  if (priceCents <= 0) return 'Free';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(priceCents / 100);
}
