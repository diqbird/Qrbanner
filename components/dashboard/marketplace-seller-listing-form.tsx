'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { MARKETPLACE_PAID_SALES_ENABLED } from '@/lib/marketplace-types';
import type { MarketplaceSellerPanelState } from '@/hooks/use-marketplace-seller';

type StyleTemplateOption = { id: string; name: string };

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

  const [templates, setTemplates] = useState<StyleTemplateOption[]>([]);
  const canAddMore = (state?.sellCheck.count ?? 0) < (state?.sellCheck.limit ?? 0);
  const paidSalesEnabled = MARKETPLACE_PAID_SALES_ENABLED;

  useEffect(() => {
    if (!canAddMore) return;
    let cancelled = false;
    fetch('/api/templates')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data.templates) ? data.templates : [];
        setTemplates(list.map((tpl: { id: string; name: string }) => ({ id: tpl.id, name: tpl.name })));
      })
      .catch(() => {
        if (!cancelled) setTemplates([]);
      });
    return () => {
      cancelled = true;
    };
  }, [canAddMore]);

  if (!canAddMore) return null;

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
          <Label>{t('marketplaceSeller.templateSelect')}</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          >
            <option value="">{t('marketplaceSeller.templateSelectNone')}</option>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button type="submit" loading={working} className="gap-2">
        <Plus className="h-4 w-4" /> {t('marketplaceSeller.publishBtn')}
      </Button>
    </form>
  );
}
