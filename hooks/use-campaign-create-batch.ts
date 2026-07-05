'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import type { CampaignPlan } from '@/lib/campaign-types';
import type { CampaignWizardStep } from '@/lib/campaign-wizard-utils';

type Translate = (key: string) => string;

export function useCampaignCreateBatch({
  plan,
  loading,
  setStep,
  setResult,
  t,
}: {
  plan: CampaignPlan | null;
  loading: boolean;
  setStep: (step: CampaignWizardStep) => void;
  setResult: (r: { campaignId: string; created: { id: string; name: string }[] }) => void;
  t: Translate;
}) {
  const handleCreate = useCallback(async () => {
    if (!plan || loading) return;
    const enabled = plan.items.filter((i) => i.enabled);
    if (!enabled.length) {
      toast.error(t('campaign.createFailed'));
      return;
    }

    setStep('creating');
    try {
      const res = await fetch('/api/campaign/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: { ...plan, items: enabled } }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? t('campaign.createFailed'));
        setStep('review');
        return;
      }
      if (data.errors?.length) {
        toast.warning(t('campaign.partialErrors'));
      }
      setResult({ campaignId: data.campaignId, created: data.created });
      setStep('done');
      toast.success(t('campaign.successTitle'));
    } catch {
      toast.error(t('campaign.createFailed'));
      setStep('review');
    }
  }, [plan, loading, setStep, setResult, t]);

  return { handleCreate };
}
