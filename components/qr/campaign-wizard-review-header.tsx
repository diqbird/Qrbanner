'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CampaignWizardState } from '@/hooks/use-campaign-wizard';

export function CampaignWizardReviewHeader({ wizard }: { wizard: CampaignWizardState }) {
  const { t, plan, llmConfigured, enabledCount } = wizard;
  if (!plan) return null;

  return (
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
  );
}
