'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Smartphone } from 'lucide-react';
import { formatScanTimeAgo, recentScanRowKey } from '@/lib/analytics-view-utils';
import {
  resolveAnalyticsBrowserLabel,
  resolveAnalyticsDeviceLabel,
} from '@/lib/i18n/resolve-analytics-scan-copy';
import type { QrAnalyticsState } from '@/hooks/use-qr-analytics';

type AnalyticsRecentScansProps = {
  analytics: QrAnalyticsState;
};

export function AnalyticsRecentScans({ analytics }: AnalyticsRecentScansProps) {
  const { t, data } = analytics;
  const scans = data?.recentScans ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-display text-base">{t('analytics.recentScans')}</CardTitle>
        <span className="text-xs text-muted-foreground">{t('analytics.updatesEvery')}</span>
      </CardHeader>
      <CardContent>
        {scans.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t('analytics.noRecentScans')}</p>
        ) : (
          <div className="space-y-2">
            {scans.slice(0, 20).map((scan, i) => (
              <div
                key={recentScanRowKey(
                  {
                    scannedAt: scan.scannedAt ? String(scan.scannedAt) : undefined,
                    country: scan.country,
                    device: scan.device,
                    browser: scan.browser,
                  },
                  i,
                )}
                className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 text-sm"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {(scan.country as string) ?? '—'}
                      {scan.city ? `, ${scan.city}` : ''}
                    </span>
                  </div>
                  <div className="hidden items-center gap-1.5 text-muted-foreground sm:flex">
                    <Smartphone className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {scan.device
                        ? resolveAnalyticsDeviceLabel(t, String(scan.device))
                        : '—'}{' '}
                      ·{' '}
                      {scan.browser
                        ? resolveAnalyticsBrowserLabel(t, String(scan.browser))
                        : '—'}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {scan.scannedAt ? formatScanTimeAgo(t, String(scan.scannedAt)) : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
