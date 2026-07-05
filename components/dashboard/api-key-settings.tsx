'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key } from 'lucide-react';
import { useApiKeySettings } from '@/hooks/use-api-key-settings';
import { ApiKeyStatusPanel } from './api-key-status-panel';
import { ApiKeyUsagePanel } from './api-key-usage-panel';
import { ApiKeyQuickRefPanel } from './api-key-quick-ref-panel';
import { ApiKeyRevealDialog } from './api-key-reveal-dialog';

export function ApiKeySettings() {
  const apiKey = useApiKeySettings();
  const { t, loading } = apiKey;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" /> {t('settings.apiKey.title')}
          </CardTitle>
          <CardDescription>{t('settings.apiKey.desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <>
              <ApiKeyStatusPanel apiKey={apiKey} />
              <ApiKeyUsagePanel apiKey={apiKey} />
              <ApiKeyQuickRefPanel apiKey={apiKey} />
            </>
          )}
        </CardContent>
      </Card>
      <ApiKeyRevealDialog apiKey={apiKey} />
    </>
  );
}
