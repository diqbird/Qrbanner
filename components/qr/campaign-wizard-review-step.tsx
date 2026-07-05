'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Printer } from 'lucide-react';
import { categoryDisplayName } from '@/lib/qr-utils';
import { campaignPrimaryFieldKey, campaignPrimaryFieldLabel } from '@/lib/campaign-wizard-utils';
import type { CampaignWizardState } from '@/hooks/use-campaign-wizard';

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
        {plan.items.map((item) => {
          const fieldKey = campaignPrimaryFieldKey(item.category);
          return (
            <Card key={item.key} className={!item.enabled ? 'opacity-50' : undefined}>
              <CardContent className="space-y-3 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.key, { name: e.target.value })}
                      className="font-medium"
                      disabled={!item.enabled}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{categoryDisplayName(item.category)}</Badge>
                      <span className="text-xs text-muted-foreground">{item.purpose}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Label htmlFor={`en-${item.key}`} className="text-xs text-muted-foreground">
                      {t('campaign.enabled')}
                    </Label>
                    <Switch
                      id={`en-${item.key}`}
                      checked={item.enabled}
                      onCheckedChange={(checked) => updateItem(item.key, { enabled: checked })}
                    />
                  </div>
                </div>
                {fieldKey && item.enabled && (
                  <div className="space-y-1">
                    <Label className="text-xs">{campaignPrimaryFieldLabel(item.category, t)}</Label>
                    <Input
                      value={item.qrData[fieldKey] ?? ''}
                      onChange={(e) => updateItemData(item.key, fieldKey, e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
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
