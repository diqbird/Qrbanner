'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { RoiMetrics } from '@/lib/analytics-roi';

export function useAnalyticsRoiSave(qrId: string, onSaved?: () => void) {
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);

  const save = async (cost: string, value: string) => {
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

  return { t, saving, save };
}

export function AnalyticsRoiMetrics({ data, t }: { data: RoiMetrics; t: (key: string) => string }) {
  const { locale } = useLanguage();
  if (data.estimatedRevenue == null && data.roi == null) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3 border-t border-border/50 pt-4">
      <div>
        <p className="text-xs text-muted-foreground">{t('analytics.roiLeads')}</p>
        <p className="font-display text-xl font-bold">{formatLocaleNumber(data.leadsCount, locale)}</p>
      </div>
      {data.estimatedRevenue != null && (
        <div>
          <p className="text-xs text-muted-foreground">{t('analytics.roiEstRevenue')}</p>
          <p className="font-display text-xl font-bold">
            {formatLocaleNumber(data.estimatedRevenue, locale)}
          </p>
        </div>
      )}
      {data.roi != null && (
        <div>
          <p className="text-xs text-muted-foreground">{t('analytics.roiPercent')}</p>
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
  );
}
