'use client';

import type { AdvancedValues } from '@/lib/advanced-settings-types';
import { AdvancedSettingsPasswordField } from './advanced-settings-password-field';
import { AdvancedSettingsLimitsFields } from './advanced-settings-limits-fields';
import { AdvancedSettingsSmartRouting } from './advanced-settings-smart-routing';

export function AdvancedSettingsSecurity({
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
  const showSmartRouting = ['url', 'menu', 'social', 'app'].includes(category);

  return (
    <>
      <AdvancedSettingsPasswordField
        values={values}
        onChange={onChange}
        hasExistingPassword={hasExistingPassword}
      />
      <AdvancedSettingsLimitsFields values={values} onChange={onChange} />
      {showSmartRouting && <AdvancedSettingsSmartRouting values={values} onChange={onChange} />}
    </>
  );
}
