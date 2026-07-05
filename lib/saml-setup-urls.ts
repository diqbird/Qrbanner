function siteBase(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    'https://qrbanner.com'
  ).replace(/\/$/, '');
}

export function getSamlAcsUrl(): string {
  return `${siteBase()}/api/auth/saml/acs`;
}

export function getSamlIssuer(workspaceSlug: string): string {
  return `${siteBase()}/api/auth/saml/metadata?workspace=${encodeURIComponent(workspaceSlug)}`;
}

export function getWorkspaceSamlPublicUrls(workspaceSlug: string) {
  return {
    acsUrl: getSamlAcsUrl(),
    entityId: getSamlIssuer(workspaceSlug),
    metadataUrl: getSamlIssuer(workspaceSlug),
    loginUrl: `${siteBase()}/api/auth/saml/login?workspace=${encodeURIComponent(workspaceSlug)}`,
  };
}

export type WorkspaceSamlConfig = {
  slug: string;
  idpEntityId: string | null;
  idpSsoUrl: string | null;
  idpCertificate: string | null;
};

export function isWorkspaceSamlConfigured(
  workspace: WorkspaceSamlConfig,
): workspace is WorkspaceSamlConfig & { idpSsoUrl: string; idpCertificate: string } {
  return Boolean(workspace.idpSsoUrl?.trim() && workspace.idpCertificate?.trim());
}

export function workspaceSamlReadyForLogin(workspace: {
  isPersonal: boolean;
  ssoProvider: string | null;
  slug: string;
  idpEntityId: string | null;
  idpSsoUrl: string | null;
  idpCertificate: string | null;
}): boolean {
  return (
    !workspace.isPersonal &&
    workspace.ssoProvider === 'saml' &&
    isWorkspaceSamlConfigured(workspace)
  );
}
