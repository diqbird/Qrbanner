'use client';

import type { CampaignWizardState } from '@/hooks/use-campaign-wizard';
import { CampaignWizardPromptGuestBanner } from './campaign-wizard-prompt-guest-banner';
import { CampaignWizardPromptForm } from './campaign-wizard-prompt-form';

type CampaignWizardPromptStepProps = {
  wizard: CampaignWizardState;
};

export function CampaignWizardPromptStep({ wizard }: CampaignWizardPromptStepProps) {
  const { isGuest } = wizard;

  return (
    <>
      {isGuest && <CampaignWizardPromptGuestBanner wizard={wizard} />}
      <CampaignWizardPromptForm wizard={wizard} />
    </>
  );
}
