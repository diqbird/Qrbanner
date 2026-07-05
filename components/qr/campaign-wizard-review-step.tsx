'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Printer } from 'lucide-react';
import type { CampaignWizardState } from '@/hooks/use-campaign-wizard';
import { CampaignWizardReviewItem } from './campaign-wizard-review-item';

type CampaignWizardReviewStepProps = {
  wizard: CampaignWizardState;
};

export function CampaignWizardReviewStep({ wizard }: CampaignWizardReviewStepProps) {
  const {
    t,
    plan,
    llmConfigured,
    loading,
    enabledCount,
    setStep,
    updateItem,
    updateItemData,
    handleGenerate,
    handleCreate,
  } = wizard;

  if (!plan) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="font-display">{plan.businessName}</CardTitle>
              <CardDescription className="mt-1">{plan.summary}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {plan.source === 'llm' ? t('campaign.sourceLlm') : t('campaign.sourceTemplate')}
              </Badge>
              <Badge variant="outline">
                {t('campaign.itemsCount').replace('{count}', String(enabledCount))}
              </Badge>
            </div>
          </div>
        </CardHeader>
        {!llmConfigured && (
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">{t('campaign.noLlm')}</p>
          </CardContent>
        )}
      </Card>

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

      {plan.printSuggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-display text-base">
              <Printer className="h-4 w-4 text-primary" />
              {t('campaign.printIdeas')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {plan.printSuggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => setStep('prompt')}>
          {t('create.back')}
        </Button>
        <Button variant="outline" onClick={handleGenerate} disabled={loading}>
          {t('campaign.regenerate')}
        </Button>
        <Button onClick={handleCreate} disabled={enabledCount === 0} className="gap-2">
          {t('campaign.createAll').replace('{count}', String(enabledCount))}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
