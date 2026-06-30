export type OAuthProviderId = 'google' | 'github' | 'azure-ad';

export function getOAuthProviderIds(): OAuthProviderId[] {
  const ids: OAuthProviderId[] = [];
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    ids.push('google');
  }
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    ids.push('github');
  }
  if (
    process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET &&
    process.env.AZURE_AD_TENANT_ID
  ) {
    ids.push('azure-ad');
  }
  return ids;
}

export function resolveCallbackUrl(raw: string | null | undefined): string {
  if (!raw) return '/dashboard';
  if (raw.startsWith('/')) {
    if (raw.startsWith('//')) return '/dashboard';
    return raw;
  }
  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase();
    if (host === 'qrbanner.com' || host === 'www.qrbanner.com' || host === 'localhost') {
      return u.pathname + u.search + u.hash;
    }
  } catch {
    /* ignore */
  }
  return '/dashboard';
}
