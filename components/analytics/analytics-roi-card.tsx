'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import type { RoiMetrics } from '@/lib/analytics-roi';

export function AnalyticsRoiCard({
  qrId,
  data,
  onSaved,
}: {
  qrId: string;
  data: RoiMetrics;
  onSaved?: () => void;
}) {
  const { t } = useLanguage();
  const [cost, setCost] = useState(data.campaignCost != null ? String(data.campaignCost) : '');
  const [value, setValue] = useState(data.valuePerLead != null ? String(data.valuePerLead) : '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/qr/${qrId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analyticsCampaignCost: cost.trim() === '' ? null : Number(cost),
          analyticsValuePerLead: value.trim() === '' ? null : Number(value),
        }),
      });
      if (!res.ok) {
        toast.error(t('analytics.roiSaveFailed'));
        return;
      }
      toast.success(t('analytics.roiSaved'));
      onSaved?.();
    } catch {
      toast.error(t('analytics.roiSaveFailed'));
    } finally {
      setSaving(false);
    }
  };

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
              placeholder="0"
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
              placeholder="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>

        <Button type="button" variant="outline" size="sm" loading={saving} onClick={handleSave}>
          {t('analytics.roiSave')}
        </Button>

        {(data.estimatedRevenue != null || data.roi != null) && (
          <div className="grid gap-4 sm:grid-cols-3 border-t border-border/50 pt-4">
            <div>
              <p className="text-xs text-muted-foreground">{t('analytics.roiLeads')}</p>
              <p className="font-display text-xl font-bold">{data.leadsCount}</p>
            </div>
            {data.estimatedRevenue != null && (
              <div>
                <p className="text-xs text-muted-foreground">{t('analytics.roiEstRevenue')}</p>
                <p className="font-display text-xl font-bold">{data.estimatedRevenue.toLocaleString()}</p>
              </div>
            )}
            {data.roi != null && (
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {t('analytics.roiPercent')}
                </p>
                <p
                  className={`font-display text-xl font-bold ${
                    data.roi >= 0 ? 'text-emerald-600' : 'text-destructive'
                  }`}
                >
                  {data.roi > 0 ? '+' : ''}
                  {data.roi}%
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">{t('analytics.roiDisclaimer')}</p>
      </CardContent>
    </Card>
  );
}
