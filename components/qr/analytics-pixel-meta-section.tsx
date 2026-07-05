'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { PixelAnalyticsConfig } from '@/lib/pixel-analytics';

export function AnalyticsPixelMetaSection({
  values,
  onChange,
}: {
  values: PixelAnalyticsConfig;
  onChange: (v: PixelAnalyticsConfig) => void;
}) {
  const set = (patch: Partial<PixelAnalyticsConfig>) => onChange({ ...values, ...patch });

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Meta Pixel (Facebook)</p>
          <p className="text-xs text-muted-foreground">Pixel ID from Events Manager</p>
        </div>
        <Switch checked={values.metaPixelEnabled} onCheckedChange={(v) => set({ metaPixelEnabled: v })} />
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
  );
}
