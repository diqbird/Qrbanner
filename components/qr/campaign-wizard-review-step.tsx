'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { CampaignWizardState } from '@/hooks/use-campaign-wizard';
import { CampaignWizardReviewItem } from './campaign-wizard-review-item';
import { CampaignWizardReviewHeader } from './campaign-wizard-review-header';
import { CampaignWizardReviewPrintIdeas } from './campaign-wizard-review-print-ideas';

type CampaignWizardReviewStepProps = {
  wizard: CampaignWizardState;
};

export function CampaignWizardReviewStep({ wizard }: CampaignWizardReviewStepProps) {
  const { t, plan, loading, enabledCount, setStep, updateItem, updateItemData, handleGenerate, handleCreate } =
    wizard;

  if (!plan) return null;

  return (
    <div className="space-y-6">
      <CampaignWizardReviewHeader wizard={wizard} />

      <div className="space-y-3">
        <h2 className="font-display text-lg font-semibold">{t('campaign.reviewTitle')}</h2>
        <p className="text-sm text-muted-foreground">{t('campaign.reviewSubtitle')}</p>
        {plan.items.map((item) => (
          <CampaignWizardReviewItem
            key={item.key}
            item={item}
            t={t}
            updateItem={updateItem}
            updateItemData={updateItemData}
          />
        ))}
      </div>

      <CampaignWizardReviewPrintIdeas suggestions={plan.printSuggestions} />

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => setStep('prompt')}>
          {t('create.back')}
        </Button>
        <Button variant="outline" onClick={handleGenerate} disabled={loading}>
          {t('campaign.regenerate')}
        </Button>
        <Button onClick={handleCreate} disabled={enabledCount === 0} className="gap-2">
          {t('campaign.createAll', { count: enabledCount })}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
