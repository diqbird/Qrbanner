'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { CampaignPlan } from '@/lib/campaign-types';
import type { CampaignWizardStep } from '@/lib/campaign-wizard-utils';
import { useCampaignPlanEditing } from '@/hooks/use-campaign-plan-editing';
import { useCampaignGenerate } from '@/hooks/use-campaign-generate';
import { useCampaignCreateBatch } from '@/hooks/use-campaign-create-batch';

export function useCampaignWizard() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const { status } = useSession();
  const isGuest = status === 'unauthenticated';
  const loc = locale;

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

  const { applyExample: exampleText, updateItem, updateItemData, enabledCount } = useCampaignPlanEditing(
    plan,
    setPlan,
    loc,
  );

  const applyExample = (key: Parameters<typeof exampleText>[0]) => {
    setPrompt(exampleText(key));
  };

  const { handleGenerate } = useCampaignGenerate({
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
  });

  const { handleCreate } = useCampaignCreateBatch({
    plan,
    loading,
    setStep,
    setResult,
    t,
  });

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
