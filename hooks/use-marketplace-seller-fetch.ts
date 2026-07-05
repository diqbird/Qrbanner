'use client';

import { useCallback, useEffect, useState } from 'react';
import type { MarketplaceListingRow, MarketplaceSellerState } from '@/lib/marketplace-seller-types';

export function useMarketplaceSellerFetch() {
  const [state, setState] = useState<MarketplaceSellerState | null>(null);
  const [listings, setListings] = useState<MarketplaceListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [sellerRes, listRes] = await Promise.all([
        fetch('/api/marketplace/seller'),
        fetch('/api/marketplace/listings?mine=1'),
      ]);
      if (sellerRes.ok) setState(await sellerRes.json());
      if (listRes.ok) {
        const data = await listRes.json();
        setListings(data.listings ?? []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { state, listings, loading, fetchAll };
}
