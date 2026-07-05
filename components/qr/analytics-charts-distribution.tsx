'use client';

import type { AnalyticsChartsData } from '@/lib/analytics-chart-constants';
import { parseAnalyticsDistribution } from '@/lib/analytics-distribution-data';
import { AnalyticsChartsDistributionPie } from './analytics-charts-distribution-pie';
import { AnalyticsChartsDistributionBars } from './analytics-charts-distribution-bars';
import { AnalyticsScanSourceCard } from './analytics-scan-source-card';

export function AnalyticsChartsDistribution({ data }: { data: AnalyticsChartsData }) {
  const dist = parseAnalyticsDistribution(data);

  return (
    <>
      <AnalyticsChartsDistributionPie dist={dist} />
      <AnalyticsChartsDistributionBars dist={dist} />
      <AnalyticsScanSourceCard dist={dist} />
    </>
  );
}
