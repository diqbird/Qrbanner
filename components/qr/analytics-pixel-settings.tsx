'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-primary" /> GA4 & Meta Pixel
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Fire tracking pixels when users scan your QR — on the landing page or before redirect.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <AnalyticsPixelGa4Section values={values} onChange={onChange} />
        <AnalyticsPixelMetaSection values={values} onChange={onChange} />
        <p className="text-xs text-muted-foreground">
          Events: <code className="text-[10px]">PageView</code> on scan,
          <code className="text-[10px]"> qr_scan</code> / <code className="text-[10px]">QRScan</code> on direct redirect,
          <code className="text-[10px]"> qr_cta_click</code> / <code className="text-[10px]">Lead</code> on landing CTA.
          CTA clicks are also tracked in QRbanner analytics when a landing page is enabled.
        </p>
      </CardContent>
    </Card>
  );
}
