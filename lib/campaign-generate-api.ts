import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import type { CampaignPlan } from '@/lib/campaign-types';
import type { CampaignWizardStep } from '@/lib/campaign-wizard-utils';

type Translate = (key: string) => string;

type GeneratePayload = {
  prompt: string;
  locale: 'tr' | 'en';
  businessName?: string;
  websiteUrl?: string;
};

type GenerateResponse = {
  plan?: CampaignPlan;
  llmConfigured?: boolean;
  error?: string;
};

export async function postCampaignGenerate(payload: GeneratePayload): Promise<{
  res: Response;
  data: GenerateResponse;
  parseOk: boolean;
}> {
  const res = await fetch('/api/campaign/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  try {
    const data = (await res.json()) as GenerateResponse;
    return { res, data, parseOk: true };
  } catch {
    return { res, data: {}, parseOk: false };
  }
}

export function handleCampaignGenerateResponse({
  res,
  data,
  router,
  setPlan,
  setLlmConfigured,
  setStep,
  t,
}: {
  res: Response;
  data: GenerateResponse;
  router: AppRouterInstance;
  setPlan: (plan: CampaignPlan) => void;
  setLlmConfigured: (v: boolean) => void;
  setStep: (step: CampaignWizardStep) => void;
  t: Translate;
}): boolean {
  if (res.status === 401) {
    router.push(`/signup?callbackUrl=${encodeURIComponent('/qr/campaign')}`);
    return false;
  }
  if (res.status === 429) {
    toast.error(t('campaign.rateLimited'));
    return false;
  }
  if (res.status === 400) {
    toast.error(
      data.error === 'prompt_too_long'
        ? t('campaign.promptTooLong')
        : data.error === 'invalid_json'
          ? t('campaign.generateFailed')
          : t('campaign.promptTooShort'),
    );
    return false;
  }
  if (res.status === 415) {
    toast.error(t('campaign.generateFailed'));
    return false;
  }
  if (!res.ok || !data.plan) {
    toast.error(t('campaign.generateFailed'));
    return false;
  }
  setPlan(data.plan);
  setLlmConfigured(Boolean(data.llmConfigured));
  setStep('review');
  return true;
}
