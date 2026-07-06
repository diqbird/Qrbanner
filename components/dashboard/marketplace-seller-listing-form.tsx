'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { MARKETPLACE_PAID_SALES_ENABLED } from '@/lib/marketplace-types';
import type { MarketplaceSellerPanelState } from '@/hooks/use-marketplace-seller';

export function MarketplaceSellerListingForm({ seller }: { seller: MarketplaceSellerPanelState }) {
  const {
    t,
    state,
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
  } = seller;

  const canAddMore = (state?.sellCheck.count ?? 0) < (state?.sellCheck.limit ?? 0);
  if (!canAddMore) return null;

  const paidSalesEnabled = MARKETPLACE_PAID_SALES_ENABLED;

  return (
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
          <Label>
            {paidSalesEnabled ? t('marketplaceSeller.priceUsd') : t('marketplaceSeller.priceUsdFreeOnly')}
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={priceUsd}
            readOnly={!paidSalesEnabled}
            disabled={!paidSalesEnabled}
            onChange={(e) => setPriceUsd(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('marketplaceSeller.templateId')}</Label>
          <Input
            placeholder={t('marketplaceSeller.templateIdPlaceholder')}
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" loading={working} className="gap-2">
        <Plus className="h-4 w-4" /> {t('marketplaceSeller.publishBtn')}
      </Button>
    </form>
  );
}
