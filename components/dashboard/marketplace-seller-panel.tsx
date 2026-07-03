'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Store, Plus, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatListingPrice, MARKETPLACE_PLATFORM_FEE_PERCENT } from '@/lib/marketplace-types';

interface ListingRow {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  templateId: string | null;
  status: string;
}

interface SellerState {
  seller: {
    displayName: string;
    connectOnboardingDone: boolean;
    payoutsEnabled: boolean;
  } | null;
  sellCheck: { ok: boolean; limit: number; count: number; reason?: string };
}

export function MarketplaceSellerPanel() {
  const { t } = useLanguage();
  const [state, setState] = useState<SellerState | null>(null);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceUsd, setPriceUsd] = useState('0');
  const [templateId, setTemplateId] = useState('');

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

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  const canSell = (state?.sellCheck.limit ?? 0) > 0;

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
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
            <p>{t('marketplaceSeller.proRequired')}</p>
            <Link href="/pricing" className="mt-3 inline-block">
              <Button size="sm" variant="outline">{t('planUsage.viewPricing')}</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                {t('marketplaceSeller.listingCount', {
                  count: state?.sellCheck.count ?? 0,
                  limit: state?.sellCheck.limit ?? 0,
                })}
              </span>
              {state?.seller?.connectOnboardingDone ? (
                <Badge>{t('marketplaceSeller.connectReady')}</Badge>
              ) : (
                <Button size="sm" variant="outline" loading={working} onClick={startConnect} className="gap-2">
                  <ExternalLink className="h-4 w-4" /> {t('marketplaceSeller.connectStripe')}
                </Button>
              )}
            </div>

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

            {(state?.sellCheck.count ?? 0) < (state?.sellCheck.limit ?? 0) && (
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
        )}
      </CardContent>
    </Card>
  );
}
