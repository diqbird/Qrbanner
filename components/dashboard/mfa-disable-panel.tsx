'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MfaSettingsState } from '@/hooks/use-mfa-settings';

function sanitizeMfaInput(value: string): string {
  return value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase().slice(0, 19);
}

export function MfaDisablePanel({ mfa }: { mfa: MfaSettingsState }) {
  const {
    t,
    hasPassword,
    working,
    disableCode,
    setDisableCode,
    disablePassword,
    setDisablePassword,
    disableMfa,
    regenerateRecoveryCodes,
    recoveryCodesRemaining,
  } = mfa;

  return (
    <div className="space-y-4">
      <p className="text-sm text-green-600 dark:text-green-400">{t('settings.mfa.statusOn')}</p>
      <p className="text-sm text-muted-foreground">
        {t('settings.mfa.recoveryRemaining').replace('{count}', String(recoveryCodesRemaining))}
      </p>
      <div className="space-y-2">
        <Label htmlFor="disable-code">{t('settings.mfa.codeOrRecoveryLabel')}</Label>
        <Input
          id="disable-code"
          autoComplete="one-time-code"
          value={disableCode}
          onChange={(e) => setDisableCode(sanitizeMfaInput(e.target.value))}
          placeholder={t('settings.mfa.codeOrRecoveryPlaceholder')}
          className="max-w-xs font-mono"
        />
      </div>
      {hasPassword && (
        <div className="space-y-2">
          <Label htmlFor="disable-password">{t('settings.currentPassword')}</Label>
          <Input
            id="disable-password"
            type="password"
            value={disablePassword}
            onChange={(e) => setDisablePassword(e.target.value)}
            className="max-w-xs"
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="destructive" loading={working} onClick={disableMfa}>
          {t('settings.mfa.disable')}
        </Button>
        <Button type="button" variant="outline" loading={working} onClick={regenerateRecoveryCodes}>
          {t('settings.mfa.recoveryRegenerate')}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{t('settings.mfa.recoveryRegenerateHint')}</p>
    </div>
  );
}
