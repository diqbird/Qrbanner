'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ApiKeySettingsState } from '@/hooks/use-api-key-settings';

export function ApiKeyAllowlistPanel({ apiKey }: { apiKey: ApiKeySettingsState }) {
  const {
    t,
    hasKey,
    working,
    allowlistDraft,
    setAllowlistDraft,
    saveAllowlist,
  } = apiKey;

  if (!hasKey) return null;

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <div className="space-y-1">
        <Label htmlFor="api-ip-allowlist">{t('settings.apiKey.allowlistTitle')}</Label>
        <p className="text-sm text-muted-foreground">{t('settings.apiKey.allowlistDesc')}</p>
      </div>
      <Textarea
        id="api-ip-allowlist"
        value={allowlistDraft}
        onChange={(e) => setAllowlistDraft(e.target.value)}
        placeholder={t('settings.apiKey.allowlistPlaceholder')}
        className="min-h-[100px] font-mono text-sm"
        spellCheck={false}
      />
      <Button type="button" variant="outline" loading={working} onClick={saveAllowlist}>
        {t('settings.apiKey.allowlistSave')}
      </Button>
    </div>
  );
}
