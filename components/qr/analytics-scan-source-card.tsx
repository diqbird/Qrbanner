'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Nfc } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { resolveAnalyticsScanSourceLabel } from '@/lib/i18n/resolve-analytics-scan-copy';
import type { AnalyticsDistributionData } from '@/lib/analytics-distribution-data';

export function AnalyticsScanSourceCard({ dist }: { dist: AnalyticsDistributionData }) {
  const { t, locale } = useLanguage();

  if (dist.scansBySource.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Nfc className="h-4 w-4 text-primary" /> {t('analytics.charts.scanSource')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {dist.scansBySource.map((s) => (
            <div key={s.name} className="flex justify-between text-sm">
              <span>{resolveAnalyticsScanSourceLabel(t, s.name)}</span>
              <span className="font-mono">{formatLocaleNumber(s.value, locale)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
