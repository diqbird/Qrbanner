'use client';

import { useEffect, useState } from 'react';

interface BillingStatus {
  configured: boolean;
  annualAvailable?: boolean;
  provider: 'paddle' | 'stripe' | null;
  paddle?: {
    clientToken: string | null;
    environment: 'sandbox' | 'production';
  } | null;
}

export function useBillingStatus() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/billing/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: BillingStatus | null) => {
        if (!cancelled && data) setStatus(data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    loading,
    configured: status?.configured ?? false,
    annualAvailable: status?.annualAvailable ?? false,
    provider: status?.provider ?? null,
  };
}
