'use client';

import { Button } from '@/components/ui/button';
import { BookOpen, Terminal } from 'lucide-react';
import { API_BASE } from '@/lib/api-key-types';
import type { ApiKeySettingsState } from '@/hooks/use-api-key-settings';

type ApiKeyQuickRefPanelProps = {
  apiKey: ApiKeySettingsState;
};

export function ApiKeyQuickRefPanel({ apiKey }: ApiKeyQuickRefPanelProps) {
  const { t, copyCurl } = apiKey;

  return (
    <>
      <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
        <p className="text-sm font-medium flex items-center gap-2">
          <BookOpen className="h-4 w-4" /> {t('settings.apiKey.quickRef')}
        </p>
        <div className="space-y-2 text-xs font-mono text-muted-foreground">
          <p>
            {t('settings.apiKey.baseUrl')} <span className="text-foreground">{API_BASE}/api/v1</span>
          </p>
          <p>{t('settings.apiKey.authHeader')}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 text-xs">
          <div className="rounded border bg-background p-2">
            <p className="font-semibold text-foreground mb-1">GET /qr</p>
            <p className="text-muted-foreground">{t('settings.apiKey.listQr')}</p>
          </div>
          <div className="rounded border bg-background p-2">
            <p className="font-semibold text-foreground mb-1">POST /qr</p>
            <p className="text-muted-foreground">{t('settings.apiKey.createQr')}</p>
          </div>
          <div className="rounded border bg-background p-2">
            <p className="font-semibold text-foreground mb-1">PATCH /qr/:id</p>
            <p className="text-muted-foreground">{t('settings.apiKey.updateQr')}</p>
          </div>
          <div className="rounded border bg-background p-2">
            <p className="font-semibold text-foreground mb-1">GET /folders</p>
            <p className="text-muted-foreground">{t('settings.apiKey.listFolders')}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={copyCurl} className="gap-2">
          <Terminal className="h-3.5 w-3.5" /> {t('settings.apiKey.copyCurl')}
        </Button>
      </div>

      <details className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">{t('settings.apiKey.jsonExample')}</summary>
        <pre className="mt-3 overflow-x-auto rounded bg-muted p-3 text-xs">
          {`POST ${API_BASE}/api/v1/qr
Authorization: Bearer qb_live_...

{
  "name": "Store Entrance",
  "category": "url",
  "url": "https://example.com",
  "labels": ["retail"],
  "folder_id": "optional-folder-id"
}`}
        </pre>
      </details>
    </>
  );
}
