'use client';

import { useState } from 'react';
import { toast } from 'sonner';

type Translate = (key: string) => string;

export function useMarketplaceSellerConnect({ t }: { t: Translate }) {
  const [working, setWorking] = useState(false);

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

  return { working, setWorking, startConnect };
}
