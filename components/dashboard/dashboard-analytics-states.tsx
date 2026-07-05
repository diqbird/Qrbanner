'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Radio } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

export function DashboardAnalyticsLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function DashboardAnalyticsError({ onRetry }: { onRetry: () => void }) {
  const { t } = useLanguage();

  return (
    <Card className="border-destructive/30">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <AlertCircle className="h-10 w-10 text-destructive/70" />
        <p className="font-medium">{t('analytics.loadError')}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t('analytics.retry')}
        </Button>
      </CardContent>
    </Card>
  );
}

export function DashboardAnalyticsEmpty() {
  const { t } = useLanguage();

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Radio className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="font-medium text-muted-foreground">{t('analytics.noScans')}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t('analytics.noScansHint')}</p>
        <ul className="mt-4 max-w-sm space-y-2 text-left text-sm text-muted-foreground">
          <li>• {t('analytics.emptyTip1')}</li>
          <li>• {t('analytics.emptyTip2')}</li>
          <li>• {t('analytics.emptyTip3')}</li>
        </ul>
        <Link href="/qr/create?quick=1" className="mt-6">
          <Button size="sm">{t('analytics.emptyCta')}</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
