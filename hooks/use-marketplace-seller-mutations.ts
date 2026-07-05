'use client';

import { useState } from 'react';
import { toast } from 'sonner';

type Translate = (key: string) => string;

export function useMarketplaceSellerMutations({
  t,
  fetchAll,
}: {
  t: Translate;
  fetchAll: () => Promise<void>;
}) {
  const [working, setWorking] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceUsd, setPriceUsd] = useState('0');
  const [templateId, setTemplateId] = useState('');

  const startConnect = async () => {
    setWorking(true);
    try {
      const res = await fetch('/api/marketplace/connect/onboard', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.fallback === 'stripe_connect_required') {
        toast.message(t('marketplaceSeller.connectPending'));
        return;
      }
      toast.error(data.error ?? t('auth.somethingWrong'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const createListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return toast.error(t('marketplaceSeller.fieldsRequired'));
    }
    setWorking(true);
    try {
      const priceCents = Math.round(parseFloat(priceUsd || '0') * 100);
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
    working,
    title,
    setTitle,
    description,
    setDescription,
    priceUsd,
    setPriceUsd,
    templateId,
    setTemplateId,
    startConnect,
    createListing,
    archiveListing,
  };
}
