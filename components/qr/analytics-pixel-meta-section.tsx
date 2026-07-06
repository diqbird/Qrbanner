'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/components/i18n/language-provider';
import type { PixelAnalyticsConfig } from '@/lib/pixel-analytics';

export function AnalyticsPixelMetaSection({
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
          <p className="text-sm font-medium">{t('qrFeatures.pixelMetaTitle')}</p>
          <p className="text-xs text-muted-foreground">{t('qrFeatures.pixelMetaHint')}</p>
        </div>
        <Switch checked={values.metaPixelEnabled} onCheckedChange={(v) => set({ metaPixelEnabled: v })} />
      </div>
      {values.metaPixelEnabled && (
        <div className="space-y-2">
          <Label className="text-xs">{t('qrFeatures.pixelMetaId')}</Label>
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
