'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Copy, KeyRound } from 'lucide-react';
import type { EnterpriseWorkspaceState } from '@/hooks/use-enterprise-workspace';

type EnterpriseScimPanelProps = {
  enterprise: EnterpriseWorkspaceState;
};

export function EnterpriseScimPanel({ enterprise }: EnterpriseScimPanelProps) {
  const { t, state, working, scimToken, toggleScim, regenerateScimToken, copyText } = enterprise;

  if (!state) return null;
  const { workspace, scimBaseUrl } = state;

  return (
    <div className="rounded-lg border border-border/50 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">{t('enterpriseWorkspace.scimTitle')}</p>
      </div>
      <p className="text-xs text-muted-foreground">{t('enterpriseWorkspace.scimDesc')}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('enterpriseWorkspace.enableScim')}</span>
        <Switch checked={workspace.scimEnabled} onCheckedChange={toggleScim} />
      </div>
      <div className="rounded-md bg-muted/40 p-3 text-xs space-y-2">
        <p className="font-medium">{t('enterpriseWorkspace.scimBaseUrl')}</p>
        <code className="block break-all">{scimBaseUrl}</code>
        {workspace.scimTokenPrefix && (
          <p className="text-muted-foreground">
            {t('enterpriseWorkspace.scimTokenPrefix')}: {workspace.scimTokenPrefix}…
          </p>
        )}
      </div>
      {scimToken && (
        <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs space-y-2">
          <p className="font-medium">{t('enterpriseWorkspace.scimTokenOnce')}</p>
          <code className="block break-all font-mono">{scimToken}</code>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={() => copyText(scimToken, 'SCIM token')}
          >
            <Copy className="h-3 w-3" /> {t('enterpriseWorkspace.copyToken')}
          </Button>
        </div>
      )}
      <Button type="button" variant="outline" loading={working} onClick={regenerateScimToken}>
        {t('enterpriseWorkspace.regenerateScimToken')}
      </Button>
    </div>
  );
}
