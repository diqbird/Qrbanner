'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { SettingsAccountState } from '@/hooks/use-settings-account';

function sanitizeMfa(value: string) {
  return value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase().slice(0, 19);
}

export function SettingsAccountDeleteCard({ account }: { account: SettingsAccountState }) {
  const { t } = account;
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/mfa');
        if (!res.ok) return;
        const data = (await res.json()) as { enabled?: boolean; hasPassword?: boolean };
        if (!cancelled) {
          setMfaEnabled(Boolean(data.enabled));
          if (typeof data.hasPassword === 'boolean') setHasPassword(data.hasPassword);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async () => {
    if (confirmation.trim() !== 'DELETE') {
      toast.error(t('settings.deleteAccount.confirmRequired'));
      return;
    }
    if (hasPassword && !password) {
      toast.error(t('settings.fillAllFields'));
      return;
    }
    if (mfaEnabled && !mfaCode.trim()) {
      toast.error(t('settings.mfaCodeRequired'));
      return;
    }
    if (!confirm(t('settings.deleteAccount.finalConfirm'))) return;

    setWorking(true);
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmation: confirmation.trim(),
          currentPassword: hasPassword ? password : undefined,
          mfaCode: mfaEnabled ? mfaCode.trim() : undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(resolveApiError(t, json.error, 'settings.deleteAccount.failed'));
        return;
      }
      toast.success(t('settings.deleteAccount.deleted'));
      await signOut({ callbackUrl: '/' });
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" /> {t('settings.deleteAccount.title')}
        </CardTitle>
        <CardDescription>{t('settings.deleteAccount.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!open ? (
          <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
            {t('settings.deleteAccount.open')}
          </Button>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{t('settings.deleteAccount.warn')}</p>
            <div className="space-y-2 max-w-sm">
              <Label htmlFor="delete-confirm">{t('settings.deleteAccount.typeDelete')}</Label>
              <Input
                id="delete-confirm"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="DELETE"
                autoComplete="off"
                className="font-mono"
              />
            </div>
            {hasPassword && (
              <div className="space-y-2 max-w-sm">
                <Label htmlFor="delete-password">{t('settings.currentPassword')}</Label>
                <Input
                  id="delete-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
            {mfaEnabled && (
              <div className="space-y-2 max-w-sm">
                <Label htmlFor="delete-mfa">{t('settings.mfa.codeOrRecoveryLabel')}</Label>
                <Input
                  id="delete-mfa"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(sanitizeMfa(e.target.value))}
                  placeholder={t('settings.mfa.codeOrRecoveryPlaceholder')}
                  className="font-mono"
                  autoComplete="one-time-code"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="destructive" loading={working} onClick={handleDelete}>
                {t('settings.deleteAccount.submit')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={working}
                onClick={() => {
                  setOpen(false);
                  setConfirmation('');
                  setPassword('');
                  setMfaCode('');
                }}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
