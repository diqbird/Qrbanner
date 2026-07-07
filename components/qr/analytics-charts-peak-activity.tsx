'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { AnalyticsChartsData } from '@/lib/analytics-chart-constants';

export function AnalyticsChartsPeakActivity({ peakInsights }: { peakInsights: AnalyticsChartsData['peakInsights'] }) {
  const { t, locale } = useLanguage();

  if (!peakInsights?.peakDay && !peakInsights?.peakHour) return null;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> {t('analytics.charts.peakActivity')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-6">
        {peakInsights?.peakDay && (
          <div>
            <p className="text-xs text-muted-foreground">{t('analytics.charts.mostActiveDay')}</p>
            <p className="text-lg font-semibold">
              {peakInsights.peakDay.name}{' '}
              <span className="text-sm text-muted-foreground">
                ({t('analytics.charts.scanCount', { n: formatLocaleNumber(peakInsights.peakDay.count, locale) })})
              </span>
            </p>
          </div>
        )}
        {peakInsights?.peakHour && (
          <div>
            <p className="text-xs text-muted-foreground">{t('analytics.charts.mostActiveHour')}</p>
            <p className="text-lg font-semibold">
              {peakInsights.peakHour.name}{' '}
              <span className="text-sm text-muted-foreground">
                ({t('analytics.charts.scanCount', { n: formatLocaleNumber(peakInsights.peakHour.count, locale) })})
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
