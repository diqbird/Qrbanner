'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { AdvancedSettingsSecurity } from './advanced-settings-security';
import { AdvancedSettingsUtm } from './advanced-settings-utm';
import type { AdvancedValues } from '@/lib/advanced-settings-types';

export type { AdvancedValues } from '@/lib/advanced-settings-types';
export { emptyAdvanced } from '@/lib/advanced-settings-types';

export function AdvancedSettings({
  category,
  values,
  onChange,
  hasExistingPassword,
}: {
  category: string;
  values: AdvancedValues;
  onChange: (v: AdvancedValues) => void;
  hasExistingPassword?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> {t('qrFeatures.advancedTitle')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t('qrFeatures.advancedSubtitle')}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <AdvancedSettingsSecurity
          category={category}
          values={values}
          onChange={onChange}
          hasExistingPassword={hasExistingPassword}
        />
        <AdvancedSettingsUtm values={values} onChange={onChange} />
      </CardContent>
    </Card>
  );
}
