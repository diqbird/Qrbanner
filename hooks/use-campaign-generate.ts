'use client';

import { useCallback } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import type { CampaignPlan } from '@/lib/campaign-types';
import type { CampaignWizardStep } from '@/lib/campaign-wizard-utils';

type Translate = (key: string) => string;

export function useCampaignGenerate({
  prompt,
  businessName,
  websiteUrl,
  loc,
  isGuest,
  loading,
  setLoading,
  setPlan,
  setLlmConfigured,
  setStep,
  router,
  t,
}: {
  prompt: string;
  businessName: string;
  websiteUrl: string;
  loc: 'tr' | 'en';
  isGuest: boolean;
  loading: boolean;
  setLoading: (v: boolean) => void;
  setPlan: (plan: CampaignPlan) => void;
  setLlmConfigured: (v: boolean) => void;
  setStep: (step: CampaignWizardStep) => void;
  router: AppRouterInstance;
  t: Translate;
}) {
  const handleGenerate = useCallback(async () => {
    if (loading) return;
    if (prompt.trim().length < 8) {
      toast.error(t('campaign.promptTooShort'));
      return;
    }
    if (isGuest) {
      router.push(`/signup?callbackUrl=${encodeURIComponent('/qr/campaign')}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/campaign/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          locale: loc,
          businessName: businessName.trim() || undefined,
          websiteUrl: websiteUrl.trim() || undefined,
        }),
      });
      let data: { plan?: CampaignPlan; llmConfigured?: boolean; error?: string };
      try {
        data = await res.json();
      } catch {
        toast.error(t('campaign.generateFailed'));
        return;
      }
      if (res.status === 401) {
        router.push(`/signup?callbackUrl=${encodeURIComponent('/qr/campaign')}`);
        return;
      }
      if (res.status === 429) {
        toast.error(t('campaign.rateLimited'));
        return;
      }
      if (res.status === 400) {
        toast.error(
          data.error === 'prompt_too_long'
            ? t('campaign.promptTooLong')
            : data.error === 'invalid_json'
              ? t('campaign.generateFailed')
              : t('campaign.promptTooShort'),
        );
        return;
      }
      if (res.status === 415) {
        toast.error(t('campaign.generateFailed'));
        return;
      }
      if (!res.ok || !data.plan) {
        toast.error(t('campaign.generateFailed'));
        return;
      }
      setPlan(data.plan);
      setLlmConfigured(Boolean(data.llmConfigured));
      setStep('review');
    } catch {
      toast.error(t('campaign.generateFailed'));
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    prompt,
    isGuest,
    router,
    setLoading,
    loc,
    businessName,
    websiteUrl,
    setPlan,
    setLlmConfigured,
    setStep,
    t,
  ]);

  return { handleGenerate };
}
