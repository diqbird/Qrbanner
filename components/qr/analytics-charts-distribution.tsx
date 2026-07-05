'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Globe, Monitor, MapPin, Split, Nfc, Clock, Cpu } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AnalyticsChartsData } from '@/lib/analytics-chart-constants';
import { parseAnalyticsDistribution } from '@/lib/analytics-distribution-data';
import { AnalyticsPieChartCard } from './analytics-pie-chart-card';
import { AnalyticsBarChartCard } from './analytics-bar-chart-card';

export function AnalyticsChartsDistribution({ data }: { data: AnalyticsChartsData }) {
  const { t } = useLanguage();
  const dist = parseAnalyticsDistribution(data);

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

      {dist.scansBySource.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Nfc className="h-4 w-4 text-primary" /> {t('analytics.charts.scanSource')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dist.scansBySource.map((s) => (
                <div key={s.name} className="flex justify-between text-sm">
                  <span className="capitalize">{s.name}</span>
                  <span className="font-mono">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
