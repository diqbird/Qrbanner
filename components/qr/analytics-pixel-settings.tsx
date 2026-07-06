'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { PixelAnalyticsConfig } from '@/lib/pixel-analytics';
import { AnalyticsPixelGa4Section } from './analytics-pixel-ga4-section';
import { AnalyticsPixelMetaSection } from './analytics-pixel-meta-section';

export type { PixelAnalyticsConfig };
export { emptyPixelAnalytics } from '@/lib/pixel-analytics';

export function AnalyticsPixelSettings({
  values,
  onChange,
}: {
  values: PixelAnalyticsConfig;
  onChange: (v: PixelAnalyticsConfig) => void;
}) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-primary" /> {t('qrFeatures.pixelTitle')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t('qrFeatures.pixelSubtitle')}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <AnalyticsPixelGa4Section values={values} onChange={onChange} />
        <AnalyticsPixelMetaSection values={values} onChange={onChange} />
        <p className="text-xs text-muted-foreground">{t('qrFeatures.pixelEvents')}</p>
      </CardContent>
    </Card>
  );
}
