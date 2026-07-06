'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolvePlanDisplayName } from '@/lib/i18n/resolve-plan-display-name';
import type { PlanId } from '@/lib/plans';

export function useQrAnalyticsPlan() {
  const { locale } = useLanguage();
  const [planId, setPlanId] = useState<PlanId>('free');

  useEffect(() => {
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.plan?.id) setPlanId(d.plan.id as PlanId);
      })
      .catch(() => undefined);
  }, []);

  return resolvePlanDisplayName(planId, locale);
}
