'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import type { MfaSettingsState } from '@/hooks/use-mfa-settings';

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
  } = mfa;

  return (
    <div className="space-y-4">
      <p className="text-sm text-green-600 dark:text-green-400">{t('settings.mfa.statusOn')}</p>
      <div className="space-y-2">
        <Label htmlFor="disable-code">{t('settings.mfa.codeLabel')}</Label>
        <Input
          id="disable-code"
          inputMode="numeric"
          value={disableCode}
          onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder={t('settings.mfa.codePlaceholder')}
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
      <Button type="button" variant="destructive" loading={working} onClick={disableMfa}>
        {t('settings.mfa.disable')}
      </Button>
    </div>
  );
}
