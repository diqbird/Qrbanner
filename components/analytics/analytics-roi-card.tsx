'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import type { RoiMetrics } from '@/lib/analytics-roi';
import { useAnalyticsRoiSave, AnalyticsRoiMetrics } from './analytics-roi-sections';

export function AnalyticsRoiCard({
  qrId,
  data,
  onSaved,
}: {
  qrId: string;
  data: RoiMetrics;
  onSaved?: () => void;
}) {
  const { t, saving, save } = useAnalyticsRoiSave(qrId, onSaved);
  const [cost, setCost] = useState(data.campaignCost != null ? String(data.campaignCost) : '');
  const [value, setValue] = useState(data.valuePerLead != null ? String(data.valuePerLead) : '');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          {t('analytics.roiTitle')}
        </CardTitle>
        <CardDescription>{t('analytics.roiDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="roi-cost">{t('analytics.roiCampaignCost')}</Label>
            <Input
              id="roi-cost"
              type="number"
              min={0}
              step="0.01"
              placeholder={t('analytics.roiNumberPlaceholder')}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roi-value">{t('analytics.roiValuePerLead')}</Label>
            <Input
              id="roi-value"
              type="number"
              min={0}
              step="0.01"
              placeholder={t('analytics.roiNumberPlaceholder')}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>

        <Button type="button" variant="outline" size="sm" loading={saving} onClick={() => save(cost, value)}>
          {t('analytics.roiSave')}
        </Button>

        <AnalyticsRoiMetrics data={data} t={t} />

        <p className="text-xs text-muted-foreground">{t('analytics.roiDisclaimer')}</p>
      </CardContent>
    </Card>
  );
}
