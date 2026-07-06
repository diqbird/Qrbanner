'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/components/i18n/language-provider';
import type { PixelAnalyticsConfig } from '@/lib/pixel-analytics';

export function AnalyticsPixelGa4Section({
  values,
  onChange,
}: {
  values: PixelAnalyticsConfig;
  onChange: (v: PixelAnalyticsConfig) => void;
}) {
  const { t } = useLanguage();
  const set = (patch: Partial<PixelAnalyticsConfig>) => onChange({ ...values, ...patch });

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{t('qrFeatures.pixelGa4Title')}</p>
          <p className="text-xs text-muted-foreground">{t('qrFeatures.pixelGa4Hint')}</p>
        </div>
        <Switch checked={values.ga4Enabled} onCheckedChange={(v) => set({ ga4Enabled: v })} />
      </div>
      {values.ga4Enabled && (
        <div className="space-y-2">
          <Label className="text-xs">{t('qrFeatures.pixelGa4Id')}</Label>
          <Input
            placeholder="G-XXXXXXXXXX"
            value={values.ga4MeasurementId ?? ''}
            onChange={(e) => set({ ga4MeasurementId: e.target.value.trim() })}
            className="font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}
