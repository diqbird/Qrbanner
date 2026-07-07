'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { MARKETPLACE_PAID_SALES_ENABLED } from '@/lib/marketplace-types';
import type { MarketplaceSellerPanelState } from '@/hooks/use-marketplace-seller';

export function MarketplaceSellerConnectBar({ seller }: { seller: MarketplaceSellerPanelState }) {
  const { locale } = useLanguage();
  const { t, state, working, startConnect } = seller;
  const payoutsLive = MARKETPLACE_PAID_SALES_ENABLED;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">
        {t('marketplaceSeller.listingCount', {
          count: formatLocaleNumber(state?.sellCheck.count ?? 0, locale),
          limit: formatLocaleNumber(state?.sellCheck.limit ?? 0, locale),
        })}
      </span>
      {payoutsLive ? (
        state?.seller?.connectOnboardingDone ? (
          <Badge>{t('marketplaceSeller.connectReady')}</Badge>
        ) : (
          <Button size="sm" variant="outline" loading={working} onClick={startConnect} className="gap-2">
            <ExternalLink className="h-4 w-4" /> {t('marketplaceSeller.connectPayouts')}
          </Button>
        )
      ) : (
        <Badge variant="outline">{t('marketplaceSeller.connectPending')}</Badge>
      )}
    </div>
  );
}

export function MarketplaceSellerUpgradeNotice({ seller }: { seller: MarketplaceSellerPanelState }) {
  const { t } = seller;

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
      <p>{t('marketplaceSeller.proRequired')}</p>
      <Link href="/pricing" className="mt-3 inline-block">
        <Button size="sm" variant="outline">{t('planUsage.viewPricing')}</Button>
      </Link>
    </div>
  );
}
