'use client';

import { Globe, MapPin, Split, Clock } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AnalyticsDistributionData } from '@/lib/analytics-distribution-data';
import { AnalyticsBarChartCard } from './analytics-bar-chart-card';

export function AnalyticsChartsDistributionBars({ dist }: { dist: AnalyticsDistributionData }) {
  const { t } = useLanguage();

  return (
    <>
      {dist.scansByHour.some((h) => h.value > 0) && (
        <AnalyticsBarChartCard
          title={t('analytics.charts.scansByHour')}
          icon={Clock}
          data={dist.scansByHour}
          fill="#A19AD3"
          className="lg:col-span-2"
          height={220}
          xAngle={0}
        />
      )}

      <AnalyticsBarChartCard
        title={t('analytics.charts.topCountries')}
        icon={Globe}
        data={dist.scansByCountry}
        fill="#60B5FF"
        className="lg:col-span-2"
        emptyMessage={t('analytics.charts.noCountryData')}
      />

      {dist.scansByCity.length > 0 && (
        <AnalyticsBarChartCard
          title={t('analytics.charts.topCities')}
          icon={MapPin}
          data={dist.scansByCity}
          fill="#80D8C3"
          className="lg:col-span-2"
          xAngle={-30}
        />
      )}

      {dist.scansByAbVariant.length > 0 && (
        <AnalyticsBarChartCard
          title={t('analytics.charts.abVariants')}
          icon={Split}
          data={dist.scansByAbVariant}
          fill="#A19AD3"
          height={200}
          xAngle={0}
        />
      )}
    </>
  );
}
