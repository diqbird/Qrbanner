'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { toast } from 'sonner';

/** After Paddle success redirect, poll purchase until completed then unlock template. */
export function MarketplacePaidReturn() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const purchaseId = searchParams.get('purchase');
  const paid = searchParams.get('paid') === '1';
  const [status, setStatus] = useState<'idle' | 'polling' | 'done' | 'failed'>('idle');

  useEffect(() => {
    if (!paid || !purchaseId) return;
    let cancelled = false;
    let attempts = 0;
    setStatus('polling');

    const poll = async () => {
      try {
        const res = await fetch(`/api/marketplace/purchase?id=${encodeURIComponent(purchaseId)}`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (data.purchase?.status === 'completed' && data.purchase.redirect) {
          setStatus('done');
          toast.success(t('marketplaceSeller.purchasePaid'));
          router.replace(data.purchase.redirect);
          return;
        }
        if (data.purchase?.status === 'failed') {
          setStatus('failed');
          toast.error(t('auth.somethingWrong'));
          return;
        }
      } catch {
        /* keep polling */
      }
      attempts += 1;
      if (!cancelled && attempts < 40) {
        window.setTimeout(poll, 1500);
      } else if (!cancelled) {
        setStatus('failed');
        toast.message(t('marketplaceSeller.purchasePendingSlow'));
      }
    };

    void poll();
    return () => {
      cancelled = true;
    };
  }, [paid, purchaseId, router, t]);

  if (!paid || !purchaseId || status === 'idle' || status === 'done') return null;

  return (
    <div className="mt-6 flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
      {status === 'polling' ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : null}
      {status === 'polling'
        ? t('marketplaceSeller.purchaseConfirming')
        : t('marketplaceSeller.purchasePendingSlow')}
    </div>
  );
}
