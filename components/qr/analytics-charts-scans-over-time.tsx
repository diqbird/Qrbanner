'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatChartAxisTick, formatChartTooltipValue } from '@/lib/i18n/format-locale';
import { useMemo } from 'react';

type DayPoint = { date: string; count: number };

function mergeTrendSeries(current: DayPoint[], previous?: DayPoint[] | null) {
  return current.map((point, index) => ({
    date: point.date,
    count: point.count,
    previousCount: previous?.[index]?.count ?? 0,
  }));
}

export function AnalyticsChartsScansOverTime({
  scansByDay,
  scansByDayPrevious,
}: {
  scansByDay: DayPoint[];
  scansByDayPrevious?: DayPoint[] | null;
}) {
  const { t, locale } = useLanguage();
  const chartData = useMemo(
    () => mergeTrendSeries(scansByDay, scansByDayPrevious),
    [scansByDay, scansByDayPrevious],
  );
  const showPrevious = Boolean(scansByDayPrevious?.some((d) => d.count > 0));

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> {t('analytics.charts.scansOverTime')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60B5FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60B5FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickLine={false}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => formatChartAxisTick(v, locale)}
              />
              <Tooltip
                contentStyle={{ fontSize: 11 }}
                formatter={(value, name) => [
                  formatChartTooltipValue(value, locale),
                  name === 'previousCount'
                    ? t('analytics.charts.previousPeriod')
                    : t('analytics.charts.scans'),
                ]}
              />
              {showPrevious && <Legend wrapperStyle={{ fontSize: 11 }} />}
              <Area
                type="monotone"
                dataKey="count"
                stroke="#60B5FF"
                strokeWidth={2}
                fill="url(#colorScans)"
                name={t('analytics.charts.scans')}
              />
              {showPrevious && (
                <Area
                  type="monotone"
                  dataKey="previousCount"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  fill="none"
                  name={t('analytics.charts.previousPeriod')}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
