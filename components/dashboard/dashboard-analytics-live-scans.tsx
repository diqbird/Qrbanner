'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Smartphone } from 'lucide-react';
import { formatScanTimeAgo, recentScanRowKey } from '@/lib/analytics-view-utils';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveAnalyticsDeviceLabel,
  resolveAnalyticsOsLabel,
} from '@/lib/i18n/resolve-analytics-scan-copy';
import { resolveAnalyticsCountryLabel } from '@/lib/i18n/resolve-analytics-country-label';
import type { DashboardAnalyticsState } from '@/hooks/use-dashboard-analytics';

type DashboardAnalyticsLiveScansProps = {
  analytics: DashboardAnalyticsState;
};

export function DashboardAnalyticsLiveScans({ analytics }: DashboardAnalyticsLiveScansProps) {
  const { locale } = useLanguage();
  const { t, data } = analytics;
  const scans = data?.recentScans ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          {t('analytics.liveScans')}
        </CardTitle>
        <span className="text-xs text-muted-foreground">{t('analytics.updatesEvery')}</span>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {scans.slice(0, 8).map((scan, i) => (
            <div
              key={recentScanRowKey(scan, i)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-muted-foreground">
                  {scan.country
                    ? resolveAnalyticsCountryLabel(t, scan.country, locale)
                    : '—'}
                  {scan.city ? `, ${scan.city}` : ''}
                </span>
                <span className="hidden sm:flex items-center gap-1 text-muted-foreground/70">
                  <Smartphone className="h-3 w-3" />
                  {scan.device ? resolveAnalyticsDeviceLabel(t, scan.device) : '—'} ·{' '}
                  {scan.os ? resolveAnalyticsOsLabel(t, scan.os) : '—'}
                </span>
                {scan.qrName && (
                  <Badge variant="outline" className="hidden md:inline-flex text-xs truncate max-w-[120px]">
                    {scan.qrName}
                  </Badge>
                )}
              </div>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {scan.scannedAt ? formatScanTimeAgo(t, scan.scannedAt) : ''}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
