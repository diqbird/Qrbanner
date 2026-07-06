'use client';

import { Smartphone, Monitor, Cpu } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  localizeNamedValues,
  resolveAnalyticsBrowserLabel,
  resolveAnalyticsDeviceLabel,
  resolveAnalyticsOsLabel,
} from '@/lib/i18n/resolve-analytics-scan-copy';
import type { AnalyticsDistributionData } from '@/lib/analytics-distribution-data';
import { AnalyticsPieChartCard } from './analytics-pie-chart-card';

export function AnalyticsChartsDistributionPie({ dist }: { dist: AnalyticsDistributionData }) {
  const { t } = useLanguage();

  return (
    <>
      <AnalyticsPieChartCard
        title={t('analytics.charts.devices')}
        icon={Smartphone}
        data={localizeNamedValues(dist.scansByDevice, (name) => resolveAnalyticsDeviceLabel(t, name))}
        colorOffset={0}
      />

      <AnalyticsPieChartCard
        title={t('analytics.charts.browsers')}
        icon={Monitor}
        data={localizeNamedValues(dist.scansByBrowser, (name) => resolveAnalyticsBrowserLabel(t, name))}
        colorOffset={2}
      />

      {dist.scansByOS.length > 0 && (
        <AnalyticsPieChartCard
          title={t('analytics.charts.operatingSystems')}
          icon={Cpu}
          data={localizeNamedValues(dist.scansByOS, (name) => resolveAnalyticsOsLabel(t, name))}
          colorOffset={4}
        />
      )}
    </>
  );
}
