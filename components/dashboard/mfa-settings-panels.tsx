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
          placeholder="000000"
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

export function MfaSetupConfirmPanel({ mfa }: { mfa: MfaSettingsState }) {
  const {
    t,
    working,
    setup,
    setSetup,
    enableCode,
    setEnableCode,
    confirmEnable,
    copySecret,
  } = mfa;

  if (!setup) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t('settings.mfa.scanQr')}</p>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Image
          src={setup.qrDataUrl}
          alt={t('settings.mfa.qrAlt')}
          width={220}
          height={220}
          unoptimized
          className="rounded-lg border border-border"
        />
        <div className="space-y-2 text-sm">
          <p className="font-medium">{t('settings.mfa.manualEntry')}</p>
          <code className="block break-all rounded bg-muted px-2 py-1 text-xs">{setup.secret}</code>
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={copySecret}>
            <Copy className="h-3 w-3" /> {t('settings.mfa.copySecret')}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="enable-code">{t('settings.mfa.enterCode')}</Label>
        <Input
          id="enable-code"
          inputMode="numeric"
          value={enableCode}
          onChange={(e) => setEnableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="max-w-xs font-mono"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" loading={working} onClick={confirmEnable}>
          {t('settings.mfa.confirmEnable')}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setSetup(null)}>
          {t('common.cancel')}
        </Button>
      </div>
    </div>
  );
}

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
