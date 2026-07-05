'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MfaSettingsState } from '@/hooks/use-mfa-settings';

export function MfaStartSetupPanel({ mfa }: { mfa: MfaSettingsState }) {
  const { t, hasPassword, working, password, setPassword, startSetup } = mfa;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t('settings.mfa.statusOff')}</p>
      {hasPassword && (
        <div className="space-y-2">
          <Label htmlFor="setup-password">{t('settings.currentPassword')}</Label>
          <Input
            id="setup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="max-w-xs"
          />
        </div>
      )}
      <Button type="button" loading={working} onClick={startSetup}>
        {t('settings.mfa.startSetup')}
      </Button>
    </div>
  );
}
