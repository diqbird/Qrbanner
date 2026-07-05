'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { SettingsCardSkeleton } from '@/components/dashboard/settings-card-skeleton';
import { useSettingsResource } from '@/hooks/use-settings-resource';

type MfaStatus = {
  enabled: boolean;
  hasPassword: boolean;
};

function parseMfaStatus(json: unknown): MfaStatus {
  const data = json as Record<string, unknown>;
  return {
    enabled: Boolean(data.enabled),
    hasPassword: Boolean(data.hasPassword),
  };
}

export function MfaSettings() {
  const { t } = useLanguage();
  const { data, loading, reload } = useSettingsResource({
    url: '/api/auth/mfa',
    parse: parseMfaStatus,
  });
  const [working, setWorking] = useState(false);
  const [setup, setSetup] = useState<{
    qrDataUrl: string;
    secret: string;
    otpauthUrl: string;
  } | null>(null);
  const [password, setPassword] = useState('');
  const [enableCode, setEnableCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');

  const enabled = data?.enabled ?? false;
  const hasPassword = data?.hasPassword ?? false;

  const startSetup = async () => {
    setWorking(true);
    try {
      const res = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: hasPassword ? password : undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data.error, 'settings.mfa.setupFailed'));
        return;
      }
      setSetup({
        qrDataUrl: data.qrDataUrl,
        secret: data.secret,
        otpauthUrl: data.otpauthUrl,
      });
      setPassword('');
    } finally {
      setWorking(false);
    }
  };

  const confirmEnable = async () => {
    if (!enableCode.trim()) return;
    setWorking(true);
    try {
      const res = await fetch('/api/auth/mfa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: enableCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data.error, 'settings.mfa.enableFailed'));
        return;
      }
      toast.success(t('settings.mfa.enabled'));
      setSetup(null);
      setEnableCode('');
      reload();
    } finally {
      setWorking(false);
    }
  };

  const disableMfa = async () => {
    if (!disableCode.trim()) return;
    setWorking(true);
    try {
      const res = await fetch('/api/auth/mfa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: disableCode.trim(),
          password: hasPassword ? disablePassword : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data.error, 'settings.mfa.disableFailed'));
        return;
      }
      toast.success(t('settings.mfa.disabled'));
      setDisableCode('');
      setDisablePassword('');
      reload();
    } finally {
      setWorking(false);
    }
  };

  const copySecret = async () => {
    if (!setup?.secret) return;
    await navigator.clipboard?.writeText(setup.secret);
    toast.success(t('settings.mfa.secretCopied'));
  };

  if (loading) return <SettingsCardSkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> {t('settings.mfa.title')}
        </CardTitle>
        <CardDescription>{t('settings.mfa.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enabled ? (
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
        ) : setup ? (
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
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
