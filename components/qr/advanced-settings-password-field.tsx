'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AdvancedValues } from '@/lib/advanced-settings-types';

export function AdvancedSettingsPasswordField({
  values,
  onChange,
  hasExistingPassword,
}: {
  values: AdvancedValues;
  onChange: (v: AdvancedValues) => void;
  hasExistingPassword?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-muted-foreground" /> {t('qrFeatures.passwordLabel')}
      </Label>
      <Input
        type="password"
        autoComplete="new-password"
        placeholder={
          hasExistingPassword
            ? t('qrFeatures.passwordPlaceholderChange')
            : t('qrFeatures.passwordPlaceholderNew')
        }
        value={values.password}
        onChange={(e) => onChange({ ...values, password: e.target.value })}
      />
      <p className="text-xs text-muted-foreground">
        {t('qrFeatures.passwordHint')}
        {hasExistingPassword ? t('qrFeatures.passwordCurrentlySet') : ''}
      </p>
    </div>
  );
}
