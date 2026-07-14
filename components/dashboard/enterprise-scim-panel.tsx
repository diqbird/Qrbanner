'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, KeyRound } from 'lucide-react';
import type { EnterpriseWorkspaceState } from '@/hooks/use-enterprise-workspace';

function sanitizeMfa(value: string) {
  return value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase().slice(0, 19);
}

type EnterpriseScimPanelProps = {
  enterprise: EnterpriseWorkspaceState;
};

export function EnterpriseScimPanel({ enterprise }: EnterpriseScimPanelProps) {
  const {
    t,
    state,
    working,
    scimToken,
    toggleScim,
    regenerateScimToken,
    copyText,
    mfaEnabled,
    mfaCode,
    setMfaCode,
  } = enterprise;

  if (!state) return null;
  const { workspace, scimBaseUrl } = state;
  const hasExistingToken = Boolean(workspace.scimTokenPrefix);

  return (
    <div className="rounded-lg border border-border/50 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">{t('enterpriseWorkspace.scimTitle')}</p>
      </div>
      <p className="text-xs text-muted-foreground">{t('enterpriseWorkspace.scimDesc')}</p>
      {mfaEnabled && (
        <div className="max-w-xs space-y-2">
          <Label htmlFor="scim-token-mfa">{t('settings.mfa.codeOrRecoveryLabel')}</Label>
          <Input
            id="scim-token-mfa"
            autoComplete="one-time-code"
            value={mfaCode}
            onChange={(e) => setMfaCode(sanitizeMfa(e.target.value))}
            placeholder={t('settings.mfa.codeOrRecoveryPlaceholder')}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">{t('enterpriseWorkspace.scimMfaHint')}</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('enterpriseWorkspace.enableScim')}</span>
        <Switch
          checked={workspace.scimEnabled}
          onCheckedChange={(v) => toggleScim(v, hasExistingToken)}
        />
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
