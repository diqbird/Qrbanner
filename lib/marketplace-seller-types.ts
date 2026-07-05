export interface MarketplaceListingRow {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  templateId: string | null;
  status: string;
}

export interface MarketplaceSellerState {
  seller: {
    displayName: string;
    connectOnboardingDone: boolean;
    payoutsEnabled: boolean;
  } | null;
  sellCheck: { ok: boolean; limit: number; count: number; reason?: string };
}
