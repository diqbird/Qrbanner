'use client';

import type { MarketplaceSellerPanelState } from '@/hooks/use-marketplace-seller';
import { MarketplaceSellerListingsTable } from './marketplace-seller-listings-table';
import { MarketplaceSellerListingForm } from './marketplace-seller-listing-form';

export function MarketplaceSellerListings({ seller }: { seller: MarketplaceSellerPanelState }) {
  return (
    <>
      <MarketplaceSellerListingsTable seller={seller} />
      <MarketplaceSellerListingForm seller={seller} />
    </>
  );
}
