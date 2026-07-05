'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, Radio } from 'lucide-react';
import type { QrAnalyticsState } from '@/hooks/use-qr-analytics';
import { AnalyticsViewHeader } from './analytics-view-header';

export function AnalyticsViewLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function AnalyticsViewError({
  qrId,
  t,
  retry,
}: {
  qrId: string;
  t: QrAnalyticsState['t'];
  retry: () => void;
}) {
  return (
    <div className="space-y-4">
      <Link href={`/qr/${qrId}`}>
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> {t('bulk.back')}
        </Button>
      </Link>
      <Card className="border-destructive/30">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <AlertCircle className="h-10 w-10 text-destructive/70" />
          <p className="font-medium">{t('analytics.loadError')}</p>
          <Button variant="outline" size="sm" onClick={retry}>
            {t('analytics.retry')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function AnalyticsViewEmpty({
  qrId,
  analytics,
}: {
  qrId: string;
  analytics: QrAnalyticsState;
}) {
  const { t } = analytics;
  return (
    <div className="space-y-6">
      <AnalyticsViewHeader analytics={analytics} showExport={false} />
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Radio className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">{t('analytics.noScans')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('analytics.noScansQrHint')}</p>
          <ul className="mt-4 max-w-sm space-y-2 text-left text-sm text-muted-foreground">
            <li>• {t('analytics.emptyTip1')}</li>
            <li>• {t('analytics.emptyTip2')}</li>
            <li>• {t('analytics.emptyTip3')}</li>
          </ul>
          <Link href={`/qr/${qrId}`} className="mt-6">
            <Button size="sm">{t('analytics.emptyEditQr')}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
