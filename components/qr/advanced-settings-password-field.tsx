'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
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
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-muted-foreground" /> Password protection
      </Label>
      <Input
        type="password"
        autoComplete="new-password"
        placeholder={hasExistingPassword ? 'Password set — type to change, clear to remove' : 'Set a password (optional)'}
        value={values.password}
        onChange={(e) => onChange({ ...values, password: e.target.value })}
      />
      <p className="text-xs text-muted-foreground">
        Scanners must enter this password before being redirected.
        {hasExistingPassword ? ' A password is currently set.' : ''}
      </p>
    </div>
  );
}
