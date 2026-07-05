'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { formatListingPrice } from '@/lib/marketplace-types';
import type { MarketplaceSellerPanelState } from '@/hooks/use-marketplace-seller';

export function MarketplaceSellerListings({ seller }: { seller: MarketplaceSellerPanelState }) {
  const {
    t,
    state,
    listings,
    working,
    title,
    setTitle,
    description,
    setDescription,
    priceUsd,
    setPriceUsd,
    templateId,
    setTemplateId,
    createListing,
    archiveListing,
  } = seller;

  const canAddMore = (state?.sellCheck.count ?? 0) < (state?.sellCheck.limit ?? 0);

  return (
    <>
      {listings.length > 0 && (
        <div className="space-y-2">
          {listings.map((l) => (
            <div
              key={l.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium">{l.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatListingPrice(l.priceCents)} · {l.status}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/marketplace/${l.id}`}>
                  <Button variant="ghost" size="sm">{t('marketplaceSeller.view')}</Button>
                </Link>
                <Button variant="ghost" size="icon-sm" onClick={() => archiveListing(l.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <form onSubmit={createListing} className="space-y-3 border-t border-border/50 pt-4">
          <div className="space-y-2">
            <Label>{t('marketplaceSeller.listingTitle')}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('marketplaceSeller.listingDescription')}</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('marketplaceSeller.priceUsd')}</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('marketplaceSeller.templateId')}</Label>
              <Input
                placeholder="restaurant-menu"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" loading={working} className="gap-2">
            <Plus className="h-4 w-4" /> {t('marketplaceSeller.publishBtn')}
          </Button>
        </form>
      )}
    </>
  );
}
