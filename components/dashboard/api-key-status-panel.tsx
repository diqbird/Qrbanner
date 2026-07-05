'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Key, RefreshCw, Trash2 } from 'lucide-react';
import type { ApiKeySettingsState } from '@/hooks/use-api-key-settings';

type ApiKeyStatusPanelProps = {
  apiKey: ApiKeySettingsState;
};

export function ApiKeyStatusPanel({ apiKey }: ApiKeyStatusPanelProps) {
  const { t, hasKey, prefix, createdAt, working, generateKey, revokeKey } = apiKey;

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
                {t('settings.apiKey.created', { date: new Date(createdAt).toLocaleDateString() })}
              </span>
            )}
          </>
        ) : (
          <Badge variant="secondary">{t('settings.apiKey.noKey')}</Badge>
        )}
      </div>

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
