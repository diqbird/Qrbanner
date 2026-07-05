'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import type { CampaignPlan, CampaignQrItem } from '@/lib/campaign-types';
import { CAMPAIGN_EXAMPLES, type CampaignExampleKey, type CampaignWizardStep } from '@/lib/campaign-wizard-utils';

export function useCampaignWizard() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const { status } = useSession();
  const isGuest = status === 'unauthenticated';
  const loc = locale === 'tr' ? 'tr' : 'en';

  const [step, setStep] = useState<CampaignWizardStep>('prompt');
  const [prompt, setPrompt] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [plan, setPlan] = useState<CampaignPlan | null>(null);
  const [llmConfigured, setLlmConfigured] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    campaignId: string;
    created: { id: string; name: string }[];
  } | null>(null);

  const applyExample = (key: CampaignExampleKey) => {
    setPrompt(CAMPAIGN_EXAMPLES[key][loc]);
  };

  const updateItem = useCallback((key: string, patch: Partial<CampaignQrItem>) => {
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((it) => (it.key === key ? { ...it, ...patch } : it)),
      };
    });
  }, []);

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
  }, []);

  const handleGenerate = async () => {
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
  };

  const handleCreate = async () => {
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
  };

  const enabledCount = plan?.items.filter((i) => i.enabled).length ?? 0;

  return {
    t,
    isGuest,
    step,
    setStep,
    prompt,
    setPrompt,
    businessName,
    setBusinessName,
    websiteUrl,
    setWebsiteUrl,
    plan,
    llmConfigured,
    loading,
    result,
    applyExample,
    updateItem,
    updateItemData,
    handleGenerate,
    handleCreate,
    enabledCount,
  };
}

export type CampaignWizardState = ReturnType<typeof useCampaignWizard>;
