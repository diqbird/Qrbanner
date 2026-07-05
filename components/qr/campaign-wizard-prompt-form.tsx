'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import type { CampaignWizardState } from '@/hooks/use-campaign-wizard';

export function CampaignWizardPromptForm({ wizard }: { wizard: CampaignWizardState }) {
  const {
    t,
    prompt,
    setPrompt,
    businessName,
    setBusinessName,
    websiteUrl,
    setWebsiteUrl,
    loading,
    applyExample,
    handleGenerate,
  } = wizard;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg">{t('campaign.promptLabel')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('campaign.promptPlaceholder')}
          rows={4}
          className="resize-none"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t('campaign.businessNameLabel')}</Label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t('campaign.businessNamePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('campaign.websiteLabel')}</Label>
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://"
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{t('campaign.examples')}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => applyExample('restaurant')}>
              {t('campaign.exampleRestaurant')}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => applyExample('hotel')}>
              {t('campaign.exampleHotel')}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => applyExample('event')}>
              {t('campaign.exampleEvent')}
            </Button>
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {t('campaign.generating')}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> {t('campaign.generate')}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
