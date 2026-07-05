import { SAML, type SamlConfig } from '@node-saml/node-saml';
import {
  getSamlAcsUrl,
  getSamlIssuer,
  isWorkspaceSamlConfigured,
  type WorkspaceSamlConfig,
} from '@/lib/saml-setup-urls';

export { getSamlAcsUrl, getSamlIssuer, getWorkspaceSamlPublicUrls, isWorkspaceSamlConfigured, workspaceSamlReadyForLogin } from '@/lib/saml-setup-urls';
export type { WorkspaceSamlConfig } from '@/lib/saml-setup-urls';
export function buildSamlInstance(workspace: WorkspaceSamlConfig): SAML | null {
  if (!isWorkspaceSamlConfigured(workspace)) return null;

  const issuer = getSamlIssuer(workspace.slug);
  const config: SamlConfig = {
    issuer,
    callbackUrl: getSamlAcsUrl(),
    idpCert: workspace.idpCertificate,
    entryPoint: workspace.idpSsoUrl,
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    wantAssertionsSigned: true,
    audience: issuer,
  };

  const privateKey = process.env.SAML_SP_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const publicCert = process.env.SAML_SP_CERT?.replace(/\\n/g, '\n');
  if (privateKey && publicCert) {
    config.privateKey = privateKey;
    config.publicCert = publicCert;
  }

  return new SAML(config);
}

export function extractSamlEmail(profile: Record<string, unknown>): string | null {
  const candidates = [profile.email, profile.mail, profile.nameID, profile.nameId];
  for (const value of candidates) {
    if (typeof value === 'string' && value.includes('@')) {
      return value.toLowerCase().trim();
    }
  }
  return null;
}

export function extractSamlName(profile: Record<string, unknown>): string | null {
  const candidates = [
    profile.displayName,
    profile.givenName,
    profile.firstName,
    profile.name,
  ];
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

export function extractSamlProviderAccountId(profile: Record<string, unknown>): string {
  const nameId = profile.nameID ?? profile.nameId;
  if (typeof nameId === 'string' && nameId.trim()) return nameId.trim();
  const email = extractSamlEmail(profile);
  return email ?? `saml-${Date.now()}`;
}
