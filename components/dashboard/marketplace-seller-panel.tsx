'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';
import { MARKETPLACE_PLATFORM_FEE_PERCENT } from '@/lib/marketplace-types';
import { useMarketplaceSeller } from '@/hooks/use-marketplace-seller';
import { MarketplaceSellerConnectBar, MarketplaceSellerUpgradeNotice } from './marketplace-seller-connect';
import { MarketplaceSellerListings } from './marketplace-seller-listings';

export function MarketplaceSellerPanel() {
  const seller = useMarketplaceSeller();
  const { t, loading, canSell } = seller;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" /> {t('marketplaceSeller.title')}
        </CardTitle>
        <CardDescription>
          {t('marketplaceSeller.desc', { fee: MARKETPLACE_PLATFORM_FEE_PERCENT })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!canSell ? (
          <MarketplaceSellerUpgradeNotice seller={seller} />
        ) : (
          <>
            <MarketplaceSellerConnectBar seller={seller} />
            <MarketplaceSellerListings seller={seller} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
