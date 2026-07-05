'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Shield } from 'lucide-react';
import type { TeamWorkspaceState } from '@/hooks/use-team-workspace';
import { TeamSsoSamlFields } from './team-sso-saml-fields';

type TeamSsoPanelProps = {
  team: TeamWorkspaceState;
};

export function TeamSsoPanel({ team }: TeamSsoPanelProps) {
  const {
    t,
    workspace,
    role,
    isTeam,
    ssoProvider,
    setSsoProvider,
    allowedDomainsText,
    setAllowedDomainsText,
    working,
    saveSsoSettings,
    toggleSso,
  } = team;

  if (!isTeam || role !== 'owner' || !workspace) return null;

  return (
    <div className="rounded-lg border border-border/50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">{t('settings.team.ssoTitle')}</p>
      </div>
      <p className="text-xs text-muted-foreground">{t('settings.team.ssoDesc')}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('settings.team.enforceSso')}</span>
        <Switch checked={Boolean(workspace.ssoEnabled)} onCheckedChange={toggleSso} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sso-provider">{t('settings.team.ssoProvider')}</Label>
        <Select value={ssoProvider} onValueChange={setSsoProvider}>
          <SelectTrigger id="sso-provider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="google">{t('settings.team.ssoProviderGoogle')}</SelectItem>
            <SelectItem value="azure-ad">{t('settings.team.ssoProviderMicrosoft')}</SelectItem>
            <SelectItem value="saml">{t('settings.team.ssoProviderSaml')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {ssoProvider === 'saml' && <TeamSsoSamlFields team={team} />}
      <div className="space-y-2">
        <Label htmlFor="allowed-domains">{t('settings.team.allowedDomains')}</Label>
        <Input
          id="allowed-domains"
          placeholder={t('settings.team.allowedDomainsPlaceholder')}
          value={allowedDomainsText}
          onChange={(e) => setAllowedDomainsText(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t('settings.team.allowedDomainsHint')}</p>
      </div>
      <Button type="button" variant="outline" loading={working} onClick={() => saveSsoSettings()}>
        {t('settings.team.saveSso')}
      </Button>
    </div>
  );
}
