'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarClock, Gauge } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AdvancedValues } from '@/lib/advanced-settings-types';

export function AdvancedSettingsLimitsFields({
  values,
  onChange,
}: {
  values: AdvancedValues;
  onChange: (v: AdvancedValues) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" /> {t('qrFeatures.expirationLabel')}
        </Label>
        <Input
          type="datetime-local"
          value={values.expiresAt}
          onChange={(e) => onChange({ ...values, expiresAt: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-muted-foreground" /> {t('qrFeatures.scanLimitLabel')}
        </Label>
        <Input
          type="number"
          min={1}
          placeholder={t('qrFeatures.scanLimitPlaceholder')}
          value={values.scanLimit}
          onChange={(e) => onChange({ ...values, scanLimit: e.target.value })}
        />
      </div>
    </div>
  );
}
