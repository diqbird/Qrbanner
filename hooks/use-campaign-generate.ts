'use client';

import { useCallback } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import type { CampaignPlan } from '@/lib/campaign-types';
import type { CampaignWizardStep } from '@/lib/campaign-wizard-utils';
import {
  handleCampaignGenerateResponse,
  postCampaignGenerate,
} from '@/lib/campaign-generate-api';
import { saveCampaignGuestDraft } from '@/lib/campaign-guest-draft';
import type { Locale } from '@/lib/i18n/types';

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
  loc: Locale;
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
      saveCampaignGuestDraft({
        prompt,
        businessName,
        websiteUrl,
      });
      router.push(`/signup?callbackUrl=${encodeURIComponent('/qr/campaign')}`);
      return;
    }

    setLoading(true);
    try {
      const { res, data, parseOk } = await postCampaignGenerate({
        prompt: prompt.trim(),
        locale: loc,
        businessName: businessName.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
      });
      if (!parseOk) {
        toast.error(t('campaign.generateFailed'));
        return;
      }
      handleCampaignGenerateResponse({ res, data, router, setPlan, setLlmConfigured, setStep, t, locale: loc });
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
