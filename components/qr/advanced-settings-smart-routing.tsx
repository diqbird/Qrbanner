'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AdvancedValues } from '@/lib/advanced-settings-types';

export function AdvancedSettingsSmartRouting({
  values,
  onChange,
}: {
  values: AdvancedValues;
  onChange: (v: AdvancedValues) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-4">
      <div className="flex items-center gap-2">
        <Smartphone className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{t('qrFeatures.smartRoutingTitle')}</span>
      </div>
      <p className="text-xs text-muted-foreground">{t('qrFeatures.smartRoutingDesc')}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs">{t('qrFeatures.smartRoutingIos')}</Label>
          <Input
            placeholder={t('qrFeatures.smartRoutingIosPlaceholder')}
            value={values.iosUrl}
            onChange={(e) => onChange({ ...values, iosUrl: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">{t('qrFeatures.smartRoutingAndroid')}</Label>
          <Input
            placeholder={t('qrFeatures.smartRoutingAndroidPlaceholder')}
            value={values.androidUrl}
            onChange={(e) => onChange({ ...values, androidUrl: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
