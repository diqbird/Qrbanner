'use client';

import { Sparkles } from 'lucide-react';
import { useCampaignWizard } from '@/hooks/use-campaign-wizard';
import { CampaignWizardPromptStep } from './campaign-wizard-prompt-step';
import { CampaignWizardReviewStep } from './campaign-wizard-review-step';
import { CampaignWizardCreatingStep, CampaignWizardDoneStep } from './campaign-wizard-done-step';

export function CampaignWizard() {
  const wizard = useCampaignWizard();
  const { t, step } = wizard;

  return (
    <div className="mx-auto max-w-[800px] space-y-8">
      <div className="text-center sm:text-left">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {t('campaign.badge')}
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('campaign.title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('campaign.subtitle')}</p>
      </div>

      {step === 'prompt' && <CampaignWizardPromptStep wizard={wizard} />}
      {step === 'review' && <CampaignWizardReviewStep wizard={wizard} />}
      {step === 'creating' && <CampaignWizardCreatingStep t={t} />}
      {step === 'done' && <CampaignWizardDoneStep wizard={wizard} />}
    </div>
  );
}
