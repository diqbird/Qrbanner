'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatListingPrice } from '@/lib/marketplace-types';
import { toast } from 'sonner';

export function MarketplacePurchaseButton({
  listingId,
  priceCents,
}: {
  listingId: string;
  priceCents: number;
}) {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
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
    <Button onClick={handlePurchase} loading={loading} className="w-full sm:w-auto">
      {priceCents <= 0
        ? t('marketplaceSeller.getFree')
        : t('marketplaceSeller.buyFor', { price: formatListingPrice(priceCents) })}
    </Button>
  );
}
