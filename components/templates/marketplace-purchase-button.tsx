'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocalizedListingPrice } from '@/lib/i18n/resolve-marketplace-listing-labels';
import { MARKETPLACE_PAID_SALES_ENABLED } from '@/lib/marketplace-types';
import { toast } from 'sonner';

export function MarketplacePurchaseButton({
  listingId,
  priceCents,
}: {
  listingId: string;
  priceCents: number;
}) {
  const { t, locale } = useLanguage();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const paidPending = priceCents > 0 && !MARKETPLACE_PAID_SALES_ENABLED;

  const handleNotify = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/marketplace/${listingId}`)}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/marketplace/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? t('auth.somethingWrong'));
        return;
      }
      toast.success(t('marketplaceSeller.notifyInterestSaved'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (paidPending) {
      await handleNotify();
      return;
    }
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/marketplace/${listingId}`)}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/marketplace/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.free && data.redirect) {
        toast.success(t('marketplaceSeller.purchaseFree'));
        router.push(data.redirect);
        return;
      }
      if (data.fallback === 'payouts_not_available') {
        toast.message(t('marketplaceSeller.paymentsPending'));
        return;
      }
      toast.error(data.error ?? t('auth.somethingWrong'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={() => void handlePurchase()} loading={loading} className="w-full sm:w-auto">
      {priceCents <= 0
        ? t('marketplaceSeller.getFree')
        : paidPending
          ? t('marketplaceSeller.notifyWhenPaid')
          : t('marketplaceSeller.buyFor', { price: formatLocalizedListingPrice(priceCents, locale, t) })}
    </Button>
  );
}
