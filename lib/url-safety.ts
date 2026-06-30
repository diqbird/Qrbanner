/** Block obviously abusive redirect targets (phishing / malware patterns). */
const BLOCKED_HOST_PATTERNS = [
  /login[-.]?secure/i,
  /account[-.]?verify/i,
  /apple[-.]?id/i,
  /icloud[-.]?verify/i,
  /paypal[-.]?secure/i,
  /wallet[-.]?connect/i,
  /metamask/i,
  /crypto[-.]?gift/i,
  /free[-.]?bitcoin/i,
];

const BLOCKED_URL_SNIPPETS = [
  'signin-apple',
  'verify-account',
  'confirm-password',
  'wallet-connect',
  'claim-reward',
  'you-won',
  'urgent-action',
];

export function isBlockedRedirectUrl(raw: string): boolean {
  const url = (raw ?? '').trim();
  if (!url) return false;

  let parsed: URL;
  try {
    parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
  } catch {
    return false;
  }

  const host = parsed.hostname.toLowerCase();
  const full = parsed.href.toLowerCase();

  if (BLOCKED_HOST_PATTERNS.some((re) => re.test(host))) return true;
  if (BLOCKED_URL_SNIPPETS.some((s) => full.includes(s))) return true;

  return false;
}

export const SCAN_PAGE_HEADERS: Record<string, string> = {
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
