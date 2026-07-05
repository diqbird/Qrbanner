'use client';

import { GpsHeatmapChart } from './gps-heatmap';
import { AnalyticsChartsPeakActivity } from './analytics-charts-peak-activity';
import { AnalyticsChartsScansOverTime } from './analytics-charts-scans-over-time';
import type { AnalyticsChartsData } from '@/lib/analytics-chart-constants';

type AnalyticsChartsOverviewProps = {
  data: AnalyticsChartsData;
};

export function AnalyticsChartsOverview({ data }: AnalyticsChartsOverviewProps) {
  const scansByDay = data?.scansByDay ?? [];
  const heatmapPoints = data?.heatmapPoints ?? [];
  const peakInsights = data?.peakInsights;

  return (
    <>
      <GpsHeatmapChart points={heatmapPoints} />
      <AnalyticsChartsPeakActivity peakInsights={peakInsights} />
      <AnalyticsChartsScansOverTime scansByDay={scansByDay} />
    </>
  );
}
