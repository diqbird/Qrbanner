'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MARKETPLACE_PAID_SALES_ENABLED } from '@/lib/marketplace-types';

type Translate = (key: string) => string;

export function useMarketplaceSellerListings({
  t,
  fetchAll,
  setWorking,
}: {
  t: Translate;
  fetchAll: () => Promise<void>;
  setWorking: (v: boolean) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceUsd, setPriceUsd] = useState('0');
  const [templateId, setTemplateId] = useState('');

  const createListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return toast.error(t('marketplaceSeller.fieldsRequired'));
    }
    const priceCents = Math.round(parseFloat(priceUsd || '0') * 100);
    if (!MARKETPLACE_PAID_SALES_ENABLED && priceCents > 0) {
      return toast.error(t('marketplaceSeller.paidNotAvailable'));
    }
    setWorking(true);
    try {
      const res = await fetch('/api/marketplace/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priceCents: Number.isFinite(priceCents) ? priceCents : 0,
          templateId: templateId.trim() || null,
          status: 'published',
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error ?? t('marketplaceSeller.createFailed'));
      toast.success(t('marketplaceSeller.created'));
      setTitle('');
      setDescription('');
      setPriceUsd('0');
      setTemplateId('');
      fetchAll();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const archiveListing = async (id: string) => {
    if (!confirm(t('marketplaceSeller.confirmDelete'))) return;
    const res = await fetch(`/api/marketplace/listings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(t('marketplaceSeller.removed'));
      fetchAll();
    }
  };

  return {
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
  };
}
