'use client';

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
} from 'recharts';
import type { NamedValue } from '@/lib/analytics-distribution-data';

export function AnalyticsBarChartCard({
  title,
  icon: Icon,
  data,
  fill,
  className,
  height = 250,
  xAngle = -45,
  emptyMessage,
}: {
  title: string;
  icon: LucideIcon;
  data: NamedValue[];
  fill: string;
  className?: string;
  height?: number;
  xAngle?: number;
  emptyMessage?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {emptyMessage && data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className="w-full" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tick={{ fontSize: xAngle === 0 ? 10 : 10 }}
                  interval={0}
                  angle={xAngle}
                  textAnchor={xAngle !== 0 ? 'end' : 'middle'}
                  height={xAngle !== 0 ? 50 : undefined}
                />
                <YAxis tickLine={false} tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Bar dataKey="value" fill={fill} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
