'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { TeamWorkspaceState } from '@/hooks/use-team-workspace';

type TeamSsoSamlFieldsProps = {
  team: TeamWorkspaceState;
};

export function TeamSsoSamlFields({ team }: TeamSsoSamlFieldsProps) {
  const {
    t,
    workspace,
    idpEntityId,
    setIdpEntityId,
    idpSsoUrl,
    setIdpSsoUrl,
    idpCertificate,
    setIdpCertificate,
  } = team;

  if (!workspace) return null;

  return (
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
  );
}
