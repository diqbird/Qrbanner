'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BarChart3 } from 'lucide-react';
import type { PixelAnalyticsConfig } from '@/lib/pixel-analytics';

export type { PixelAnalyticsConfig };
export { emptyPixelAnalytics } from '@/lib/pixel-analytics';

export function AnalyticsPixelSettings({
  values,
  onChange,
}: {
  values: PixelAnalyticsConfig;
  onChange: (v: PixelAnalyticsConfig) => void;
}) {
  const set = (patch: Partial<PixelAnalyticsConfig>) => onChange({ ...values, ...patch });

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
        <div className="space-y-3 rounded-lg border border-dashed p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Google Analytics 4</p>
              <p className="text-xs text-muted-foreground">Measurement ID (G-XXXXXXXX)</p>
            </div>
            <Switch
              checked={values.ga4Enabled}
              onCheckedChange={(v) => set({ ga4Enabled: v })}
            />
          </div>
          {values.ga4Enabled && (
            <div className="space-y-2">
              <Label className="text-xs">Measurement ID</Label>
              <Input
                placeholder="G-XXXXXXXXXX"
                value={values.ga4MeasurementId ?? ''}
                onChange={(e) => set({ ga4MeasurementId: e.target.value.trim() })}
                className="font-mono text-sm"
              />
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-dashed p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Meta Pixel (Facebook)</p>
              <p className="text-xs text-muted-foreground">Pixel ID from Events Manager</p>
            </div>
            <Switch
              checked={values.metaPixelEnabled}
              onCheckedChange={(v) => set({ metaPixelEnabled: v })}
            />
          </div>
          {values.metaPixelEnabled && (
            <div className="space-y-2">
              <Label className="text-xs">Pixel ID</Label>
              <Input
                placeholder="123456789012345"
                value={values.metaPixelId ?? ''}
                onChange={(e) => set({ metaPixelId: e.target.value.replace(/\D/g, '') })}
                className="font-mono text-sm"
                inputMode="numeric"
              />
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Events: <code className="text-[10px]">PageView</code> on scan,
          <code className="text-[10px]"> qr_scan</code> / <code className="text-[10px]">QRScan</code> on direct redirect,
          <code className="text-[10px]"> qr_cta_click</code> / <code className="text-[10px]">Lead</code> on landing CTA.
        </p>
      </CardContent>
    </Card>
  );
}
