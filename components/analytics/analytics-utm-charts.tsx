'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Tag } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatChartAxisTick, formatChartTooltipValue } from '@/lib/i18n/format-locale';

type GroupRow = { name: string; value: number };

export function AnalyticsUtmCharts({
  scansByUtmSource = [],
  scansByUtmMedium = [],
  scansByUtmCampaign = [],
}: {
  scansByUtmSource?: GroupRow[];
  scansByUtmMedium?: GroupRow[];
  scansByUtmCampaign?: GroupRow[];
}) {
  const { t, locale } = useLanguage();
  const hasData =
    scansByUtmSource.length > 0 ||
    scansByUtmMedium.length > 0 ||
    scansByUtmCampaign.length > 0;

  if (!hasData) return null;

  const sections = [
    { title: t('analytics.utm.source'), data: scansByUtmSource.slice(0, 8) },
    { title: t('analytics.utm.medium'), data: scansByUtmMedium.slice(0, 8) },
    { title: t('analytics.utm.campaign'), data: scansByUtmCampaign.slice(0, 8) },
  ].filter((s) => s.data.length > 0);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          {t('analytics.utmTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-3">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 text-sm font-medium text-muted-foreground">{section.title}</p>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={section.data} layout="vertical" margin={{ left: 4, right: 8 }}>
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => formatChartAxisTick(v, locale)}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={72}
                      tick={{ fontSize: 9 }}
                      tickFormatter={(v) => (String(v).length > 12 ? `${String(v).slice(0, 11)}…` : v)}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 11 }}
                      formatter={(value) => formatChartTooltipValue(value, locale)}
                    />
                    <Bar dataKey="value" fill="#60B5FF" radius={[0, 4, 4, 0]} name={t('analytics.charts.scans')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t('analytics.utmHint')}</p>
      </CardContent>
    </Card>
  );
}
