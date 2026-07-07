'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { FunnelMetrics } from '@/lib/analytics-funnel';

export function AnalyticsFunnelPanel({ data }: { data: FunnelMetrics }) {
  const { t, locale } = useLanguage();
  const maxCount = Math.max(...data.stages.map((s) => s.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          {t('analytics.funnelTitle')}
        </CardTitle>
        <CardDescription>{t('analytics.funnelDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.stages.map((stage, i) => (
          <div key={stage.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {i + 1}. {t(`analytics.funnelStages.${stage.id}`)}
              </span>
              <span className="text-muted-foreground">
                {formatLocaleNumber(stage.count, locale)}
                {stage.rateFromPrevious != null && (
                  <span className="ml-2 text-xs">
                    ({t('analytics.funnelFromPrev', { n: formatLocaleNumber(stage.rateFromPrevious, locale) })})
                  </span>
                )}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.max(4, (stage.count / maxCount) * 100)}%` }}
              />
            </div>
          </div>
        ))}

        {data.overallConversion != null && data.stages.length > 1 && (
          <p className="text-sm text-muted-foreground border-t border-border/50 pt-3">
            {t('analytics.funnelOverall', { n: formatLocaleNumber(data.overallConversion, locale) })}
          </p>
        )}

        {data.stages.every((s) => s.count === 0) && (
          <p className="text-sm text-muted-foreground">{t('analytics.funnelEmpty')}</p>
        )}
      </CardContent>
    </Card>
  );
}
