'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  formatLocalizedListingPrice,
  resolveMarketplaceListingStatusLabel,
} from '@/lib/i18n/resolve-marketplace-listing-labels';
import type { MarketplaceSellerPanelState } from '@/hooks/use-marketplace-seller';

export function MarketplaceSellerListingsTable({ seller }: { seller: MarketplaceSellerPanelState }) {
  const { t, listings, archiveListing } = seller;
  const { locale } = useLanguage();

  if (listings.length === 0) return null;

  return (
    <div className="space-y-2">
      {listings.map((l) => (
        <div
          key={l.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm"
        >
          <div className="min-w-0">
            <p className="font-medium">{l.title}</p>
            <p className="text-xs text-muted-foreground">
              {formatLocalizedListingPrice(l.priceCents, locale, t)} ·{' '}
              {resolveMarketplaceListingStatusLabel(t, l.status)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/marketplace/${l.id}`}>
              <Button variant="ghost" size="sm">{t('marketplaceSeller.view')}</Button>
            </Link>
            <Button variant="ghost" size="icon-sm" onClick={() => archiveListing(l.id)} aria-label={t('common.removeAria')}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
