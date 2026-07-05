'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import type { PlanUsageResponse } from '@/lib/plan-usage-types';

export function usePlanUsage(refreshKey = 0) {
  const { t } = useLanguage();
  const [data, setData] = useState<PlanUsageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const openBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const body = await res.json();
      if (body?.url) {
        window.location.href = body.url;
        return;
      }
      toast.error(body?.error ?? t('billing.portalError'));
    } catch {
      toast.error(t('billing.portalError'));
    } finally {
      setPortalLoading(false);
    }
  };

  return { data, loading, portalLoading, openBillingPortal, t };
}

export type PlanUsageState = ReturnType<typeof usePlanUsage>;
