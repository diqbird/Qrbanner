'use client';

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from 'recharts';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatChartTooltipValue, formatLocaleNumber } from '@/lib/i18n/format-locale';
import { ANALYTICS_CHART_COLORS } from '@/lib/analytics-chart-constants';
import type { NamedValue } from '@/lib/analytics-distribution-data';

const COLORS = ANALYTICS_CHART_COLORS;

export function AnalyticsPieChartCard({
  title,
  icon: Icon,
  data,
  colorOffset = 0,
}: {
  title: string;
  icon: LucideIcon;
  data: NamedValue[];
  colorOffset?: number;
}) {
  const { t, locale } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[(i + colorOffset) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 11 }}
                formatter={(value) => formatChartTooltipValue(value, locale)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[(i + colorOffset) % COLORS.length] }}
              />
              <span>{d?.name ?? t('analytics.unknown')}: {formatLocaleNumber(d?.value ?? 0, locale)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
