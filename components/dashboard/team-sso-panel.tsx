'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Shield } from 'lucide-react';
import type { TeamWorkspaceState } from '@/hooks/use-team-workspace';

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
    idpEntityId,
    setIdpEntityId,
    idpSsoUrl,
    setIdpSsoUrl,
    idpCertificate,
    setIdpCertificate,
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
      {ssoProvider === 'saml' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="idp-entity-id">{t('settings.team.idpEntityId')}</Label>
            <Input
              id="idp-entity-id"
              value={idpEntityId}
              onChange={(e) => setIdpEntityId(e.target.value)}
              placeholder="https://idp.example.com/metadata"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idp-sso-url">{t('settings.team.idpSsoUrl')}</Label>
            <Input
              id="idp-sso-url"
              value={idpSsoUrl}
              onChange={(e) => setIdpSsoUrl(e.target.value)}
              placeholder="https://idp.example.com/sso/saml"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idp-certificate">{t('settings.team.idpCertificate')}</Label>
            <Textarea
              id="idp-certificate"
              value={idpCertificate}
              onChange={(e) => setIdpCertificate(e.target.value)}
              placeholder={t('settings.team.idpCertificatePlaceholder')}
              rows={5}
              className="font-mono text-xs"
            />
          </div>
          {workspace.slug && (
            <div className="space-y-2 rounded-md bg-muted/40 p-3 text-xs">
              <p className="font-medium">{t('settings.team.samlLoginUrl')}</p>
              <code className="block break-all">
                {typeof window !== 'undefined'
                  ? `${window.location.origin}/api/auth/saml/login?workspace=${workspace.slug}`
                  : `/api/auth/saml/login?workspace=${workspace.slug}`}
              </code>
              <p className="font-medium pt-2">{t('settings.team.samlMetadataUrl')}</p>
              <code className="block break-all">
                {typeof window !== 'undefined'
                  ? `${window.location.origin}/api/auth/saml/metadata?workspace=${workspace.slug}`
                  : `/api/auth/saml/metadata?workspace=${workspace.slug}`}
              </code>
            </div>
          )}
        </>
      )}
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
