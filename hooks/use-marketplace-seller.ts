'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { useMarketplaceSellerFetch } from '@/hooks/use-marketplace-seller-fetch';
import { useMarketplaceSellerMutations } from '@/hooks/use-marketplace-seller-mutations';

export function useMarketplaceSeller() {
  const { t } = useLanguage();
  const { state, listings, loading, fetchAll } = useMarketplaceSellerFetch();
  const mutations = useMarketplaceSellerMutations({ t, fetchAll });
  const canSell = (state?.sellCheck.limit ?? 0) > 0;

  return {
    t,
    state,
    listings,
    loading,
    canSell,
    ...mutations,
  };
}

export type MarketplaceSellerPanelState = ReturnType<typeof useMarketplaceSeller>;
