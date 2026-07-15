'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { MARKETPLACE_PLATFORM_FEE_PERCENT } from '@/lib/marketplace-types';
import { useMarketplaceSeller } from '@/hooks/use-marketplace-seller';
import { MarketplaceSellerConnectBar, MarketplaceSellerUpgradeNotice } from './marketplace-seller-connect';
import { MarketplaceSellerListings } from './marketplace-seller-listings';

export function MarketplaceSellerPanel() {
  const seller = useMarketplaceSeller();
  const { locale } = useLanguage();
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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="font-display flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" /> {t('marketplaceSeller.title')}
          </CardTitle>
          <Badge variant="secondary">{t('marketplaceSeller.betaBadge')}</Badge>
        </div>
        <CardDescription>
          {t('marketplaceSeller.desc', { fee: formatLocaleNumber(MARKETPLACE_PLATFORM_FEE_PERCENT, locale) })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!canSell ? (
          <MarketplaceSellerUpgradeNotice seller={seller} />
        ) : (
          <>
            <div className="rounded-lg border border-primary/25 bg-primary/5 p-4 text-sm text-muted-foreground">
              {t('marketplaceSeller.betaNotice')}
            </div>
            <MarketplaceSellerConnectBar seller={seller} />
            <MarketplaceSellerListings seller={seller} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
