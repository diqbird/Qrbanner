'use client';

import { useEffect, useState } from 'react';
import type { PublicBillingStatus } from '@/lib/public-billing-status';

export function useBillingStatus(initial?: PublicBillingStatus | null) {
  const [status, setStatus] = useState<PublicBillingStatus | null>(initial ?? null);
  const [loading, setLoading] = useState(initial == null);

  useEffect(() => {
    if (initial != null) return;
    let cancelled = false;
    fetch('/api/billing/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: PublicBillingStatus | null) => {
        if (!cancelled && data) setStatus(data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initial]);

  return {
    loading,
    configured: status?.configured ?? false,
    annualAvailable: status?.annualAvailable ?? false,
    provider: status?.provider ?? null,
  };
}
