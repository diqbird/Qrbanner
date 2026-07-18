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

/** Only web destinations may be stored as user-supplied redirect targets. */
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

export function isBlockedRedirectUrl(raw: string): boolean {
  const url = (raw ?? '').trim();
  if (!url) return false;

  // Explicit scheme that is not http(s) (javascript:, data:, vbscript:, file:, ...)
  // is never a valid QR web destination — block before host checks.
  const schemeMatch = url.match(/^([a-z][a-z0-9+.-]*):/i);
  if (schemeMatch && !ALLOWED_PROTOCOLS.has(`${schemeMatch[1].toLowerCase()}:`)) {
    return true;
  }

  let parsed: URL;
  try {
    parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
  } catch {
    return false;
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return true;

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
