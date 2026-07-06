'use client';

import { Globe, MapPin, Split, Clock } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { localizeNamedValues } from '@/lib/i18n/resolve-analytics-scan-copy';
import {
  resolveAnalyticsAbVariantLabel,
  resolveAnalyticsCountryLabel,
} from '@/lib/i18n/resolve-analytics-country-label';
import { resolveAnalyticsCityLabel } from '@/lib/i18n/resolve-analytics-city-label';
import type { AnalyticsDistributionData } from '@/lib/analytics-distribution-data';
import { AnalyticsBarChartCard } from './analytics-bar-chart-card';

export function AnalyticsChartsDistributionBars({ dist }: { dist: AnalyticsDistributionData }) {
  const { t, locale } = useLanguage();

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
        data={localizeNamedValues(dist.scansByCountry, (name) =>
          resolveAnalyticsCountryLabel(t, name, locale),
        )}
        fill="#60B5FF"
        className="lg:col-span-2"
        emptyMessage={t('analytics.charts.noCountryData')}
      />

      {dist.scansByCity.length > 0 && (
        <AnalyticsBarChartCard
          title={t('analytics.charts.topCities')}
          icon={MapPin}
          data={localizeNamedValues(dist.scansByCity, (name) =>
            resolveAnalyticsCityLabel(t, name, locale),
          )}
          fill="#80D8C3"
          className="lg:col-span-2"
          xAngle={-30}
        />
      )}

      {dist.scansByAbVariant.length > 0 && (
        <AnalyticsBarChartCard
          title={t('analytics.charts.abVariants')}
          icon={Split}
          data={localizeNamedValues(dist.scansByAbVariant, (name) =>
            resolveAnalyticsAbVariantLabel(t, name),
          )}
          fill="#A19AD3"
          height={200}
          xAngle={0}
        />
      )}
    </>
  );
}
