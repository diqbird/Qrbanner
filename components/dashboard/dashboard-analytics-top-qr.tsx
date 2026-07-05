'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';
import type { DashboardAnalyticsState } from '@/hooks/use-dashboard-analytics';

type DashboardAnalyticsTopQrProps = {
  analytics: DashboardAnalyticsState;
};

export function DashboardAnalyticsTopQr({ analytics }: DashboardAnalyticsTopQrProps) {
  const { t, topQRCodes } = analytics;
  if (!topQRCodes.length) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" /> {t('analytics.topQrCodes')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {topQRCodes.map((qr) => (
          <div
            key={qr.id}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/40"
          >
            <Link href={`/qr/${qr.id}/analytics`} className="truncate font-medium hover:text-primary">
              {qr.name}
            </Link>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">{t('analytics.allTime')}</span>
              <Badge variant="secondary" className="font-mono">
                {qr.totalScans}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
