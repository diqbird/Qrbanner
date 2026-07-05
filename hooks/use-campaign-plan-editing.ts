'use client';

import { useCallback } from 'react';
import type { CampaignPlan, CampaignQrItem } from '@/lib/campaign-types';
import { CAMPAIGN_EXAMPLES, type CampaignExampleKey } from '@/lib/campaign-wizard-utils';

export function useCampaignPlanEditing(
  plan: CampaignPlan | null,
  setPlan: React.Dispatch<React.SetStateAction<CampaignPlan | null>>,
  loc: 'tr' | 'en',
) {
  const applyExample = (key: CampaignExampleKey) => {
    return CAMPAIGN_EXAMPLES[key][loc];
  };

  const updateItem = useCallback((key: string, patch: Partial<CampaignQrItem>) => {
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((it) => (it.key === key ? { ...it, ...patch } : it)),
      };
    });
  }, [setPlan]);

  const updateItemData = useCallback((key: string, field: string, value: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((it) =>
          it.key === key ? { ...it, qrData: { ...it.qrData, [field]: value } } : it,
        ),
      };
    });
  }, [setPlan]);

  const enabledCount = plan?.items.filter((i) => i.enabled).length ?? 0;

  return { applyExample, updateItem, updateItemData, enabledCount };
}
