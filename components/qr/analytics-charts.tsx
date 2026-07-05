'use client';

import { AnalyticsChartsOverview } from './analytics-charts-overview';
import { AnalyticsChartsDistribution } from './analytics-charts-distribution';
import type { AnalyticsChartsData } from '@/lib/analytics-chart-constants';

export default function AnalyticsCharts({ data }: { data: AnalyticsChartsData }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AnalyticsChartsOverview data={data} />
      <AnalyticsChartsDistribution data={data} />
    </div>
  );
}
