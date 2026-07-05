'use client';

import { Smartphone, Monitor, Cpu } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AnalyticsDistributionData } from '@/lib/analytics-distribution-data';
import { AnalyticsPieChartCard } from './analytics-pie-chart-card';

export function AnalyticsChartsDistributionPie({ dist }: { dist: AnalyticsDistributionData }) {
  const { t } = useLanguage();

  return (
    <>
      <AnalyticsPieChartCard
        title={t('analytics.charts.devices')}
        icon={Smartphone}
        data={dist.scansByDevice}
        colorOffset={0}
      />

      <AnalyticsPieChartCard
        title={t('analytics.charts.browsers')}
        icon={Monitor}
        data={dist.scansByBrowser}
        colorOffset={2}
      />

      {dist.scansByOS.length > 0 && (
        <AnalyticsPieChartCard
          title={t('analytics.charts.operatingSystems')}
          icon={Cpu}
          data={dist.scansByOS}
          colorOffset={4}
        />
      )}
    </>
  );
}
