'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

export function AnalyticsChartsScansOverTime({ scansByDay }: { scansByDay: { date: string; count: number }[] }) {
  const { t } = useLanguage();

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
            <AreaChart data={scansByDay} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
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
              <YAxis tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#60B5FF"
                strokeWidth={2}
                fill="url(#colorScans)"
                name={t('analytics.charts.scans')}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
