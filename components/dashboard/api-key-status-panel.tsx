'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, RefreshCw, Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleDate } from '@/lib/i18n/format-locale';
import type { ApiKeySettingsState } from '@/hooks/use-api-key-settings';

type ApiKeyStatusPanelProps = {
  apiKey: ApiKeySettingsState;
};

function sanitizeMfa(value: string) {
  return value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase().slice(0, 19);
}

export function ApiKeyStatusPanel({ apiKey }: ApiKeyStatusPanelProps) {
  const { locale } = useLanguage();
  const {
    t,
    hasKey,
    prefix,
    createdAt,
    working,
    mfaEnabled,
    mfaCode,
    setMfaCode,
    generateKey,
    revokeKey,
  } = apiKey;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {hasKey ? (
          <>
            <Badge variant="default" className="gap-1">
              <Key className="h-3 w-3" /> {t('settings.apiKey.active')}
            </Badge>
            <code className="rounded bg-muted px-2 py-1 text-xs">{prefix}</code>
            {createdAt && (
              <span className="text-xs text-muted-foreground">
                {t('settings.apiKey.created', { date: formatLocaleDate(createdAt, locale) })}
              </span>
            )}
          </>
        ) : (
          <Badge variant="secondary">{t('settings.apiKey.noKey')}</Badge>
        )}
      </div>

      {mfaEnabled && (
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="api-key-mfa">{t('settings.mfa.codeOrRecoveryLabel')}</Label>
          <Input
            id="api-key-mfa"
            autoComplete="one-time-code"
            value={mfaCode}
            onChange={(e) => setMfaCode(sanitizeMfa(e.target.value))}
            placeholder={t('settings.mfa.codeOrRecoveryPlaceholder')}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">{t('settings.apiKey.mfaHint')}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={generateKey} disabled={working} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {hasKey ? t('settings.apiKey.regenerate') : t('settings.apiKey.generate')}
        </Button>
        {hasKey && (
          <Button variant="outline" onClick={revokeKey} disabled={working} className="gap-2 text-destructive">
            <Trash2 className="h-4 w-4" /> {t('settings.apiKey.revoke')}
          </Button>
        )}
      </div>
    </>
  );
}
