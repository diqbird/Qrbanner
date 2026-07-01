import { prisma } from '@/lib/db';

export type WorkspaceSsoPolicy = {
  ssoProvider: string | null;
  allowedDomains: string[];
};

export function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    .split(':')[0];
}

export function parseAllowedDomains(raw: unknown): string[] {
  if (!raw) return [];
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const domains: string[] = [];
  for (const item of raw) {
    const normalized = normalizeDomain(String(item));
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    domains.push(normalized);
  }
  return domains;
}

export function normalizeAllowedDomainsInput(input: unknown): string[] {
  if (typeof input === 'string') {
    return parseAllowedDomains(input.split(/[,;\s]+/));
  }
  return parseAllowedDomains(input);
}

export function getEmailDomain(email: string): string | null {
  const parts = email.toLowerCase().trim().split('@');
  if (parts.length !== 2 || !parts[1]) return null;
  return normalizeDomain(parts[1]);
}

export function isEmailDomainAllowed(email: string, allowedDomains: string[]): boolean {
  if (!allowedDomains.length) return true;
  const domain = getEmailDomain(email);
  if (!domain) return false;
  return allowedDomains.some((allowed) => domain === allowed || domain.endsWith(`.${allowed}`));
}

export function oauthProvidersForSso(ssoProvider: string | null | undefined): string[] {
  if (!ssoProvider || ssoProvider === 'any') return ['google', 'azure-ad'];
  if (ssoProvider === 'google') return ['google'];
  if (ssoProvider === 'microsoft' || ssoProvider === 'azure-ad' || ssoProvider === 'azure') {
    return ['azure-ad'];
  }
  return ['google', 'azure-ad'];
}

export function isOAuthProviderAllowed(
  provider: string,
  ssoProvider: string | null | undefined
): boolean {
  if (provider === 'credentials') return false;
  return oauthProvidersForSso(ssoProvider).includes(provider);
}

export async function getActiveTeamSsoPoliciesForEmail(
  email: string
): Promise<WorkspaceSsoPolicy[]> {
  const normalized = email.toLowerCase().trim();
  if (!normalized) return [];

  const members = await prisma.workspaceMember.findMany({
    where: {
      email: normalized,
      status: 'active',
      workspace: { isPersonal: false, ssoEnabled: true },
    },
    include: {
      workspace: {
        select: { ssoProvider: true, allowedDomains: true },
      },
    },
  });

  return members.map((member) => ({
    ssoProvider: member.workspace.ssoProvider,
    allowedDomains: parseAllowedDomains(member.workspace.allowedDomains),
  }));
}

export async function assertPasswordLoginAllowed(
  email: string
): Promise<{ ok: true } | { ok: false; code: string }> {
  const policies = await getActiveTeamSsoPoliciesForEmail(email);
  if (!policies.length) return { ok: true };
  return { ok: false, code: 'sso_required' };
}

export async function assertOAuthSignInAllowed(
  email: string,
  provider: string
): Promise<{ ok: true } | { ok: false; code: string }> {
  const policies = await getActiveTeamSsoPoliciesForEmail(email);
  if (!policies.length) return { ok: true };

  for (const policy of policies) {
    if (!isOAuthProviderAllowed(provider, policy.ssoProvider)) {
      return { ok: false, code: 'sso_provider_required' };
    }
    if (policy.allowedDomains.length && !isEmailDomainAllowed(email, policy.allowedDomains)) {
      return { ok: false, code: 'domain_not_allowed' };
    }
  }

  return { ok: true };
}

export function assertInviteEmailAllowed(
  workspace: { ssoEnabled: boolean; allowedDomains: unknown },
  email: string
): { ok: true } | { ok: false; code: string } {
  const domains = parseAllowedDomains(workspace.allowedDomains);
  if (!workspace.ssoEnabled || !domains.length) return { ok: true };
  if (!isEmailDomainAllowed(email, domains)) {
    return { ok: false, code: 'domain_not_allowed' };
  }
  return { ok: true };
}

export async function assertInviteAcceptAllowed(
  userId: string,
  email: string,
  workspace: { ssoEnabled: boolean; ssoProvider: string | null; allowedDomains: unknown }
): Promise<{ ok: true } | { ok: false; code: string }> {
  const domainCheck = assertInviteEmailAllowed(workspace, email);
  if (!domainCheck.ok) return domainCheck;

  if (!workspace.ssoEnabled) return { ok: true };

  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { provider: true },
  });
  const linkedProviders = accounts.map((account) => account.provider);
  if (!linkedProviders.some((provider) => isOAuthProviderAllowed(provider, workspace.ssoProvider))) {
    return { ok: false, code: 'sso_required' };
  }

  return { ok: true };
}
