'use client';

import { useMarketplaceSellerConnect } from '@/hooks/use-marketplace-seller-connect';
import { useMarketplaceSellerListings } from '@/hooks/use-marketplace-seller-listings';

type Translate = (key: string) => string;

export function useMarketplaceSellerMutations({
  t,
  fetchAll,
}: {
  t: Translate;
  fetchAll: () => Promise<void>;
}) {
  const connect = useMarketplaceSellerConnect({ t });
  const listings = useMarketplaceSellerListings({
    t,
    fetchAll,
    setWorking: connect.setWorking,
  });

  return {
    working: connect.working,
    ...listings,
    startConnect: connect.startConnect,
  };
}
