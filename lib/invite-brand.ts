/** Parse `/invite/{token}` from an auth callbackUrl. */
export function parseInviteTokenFromCallback(callbackUrl: string | null | undefined): string | null {
  if (!callbackUrl) return null;
  try {
    const path = callbackUrl.startsWith('http')
      ? new URL(callbackUrl).pathname
      : callbackUrl.split('?')[0] || '';
    const match = path.match(/^\/invite\/([A-Za-z0-9_-]+)$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export type InviteAuthBrand = {
  agencyName: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  brandColor: string | null;
  workspaceName: string | null;
};
