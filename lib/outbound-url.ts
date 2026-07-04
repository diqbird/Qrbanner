/** SSRF-safe validation for server-side outbound HTTP(S) requests (webhooks, automations). */

const PRIVATE_IPV4_PATTERNS = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
];

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata.goog',
  'instance-data',
]);

function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^\[|\]$/g, '');
}

function isPrivateIpv4(host: string): boolean {
  return PRIVATE_IPV4_PATTERNS.some((re) => re.test(host));
}

function isPrivateIpv6(host: string): boolean {
  const h = host.toLowerCase();
  if (h === '::1' || h === '::') return true;
  if (h.startsWith('fe80:')) return true;
  if (h.startsWith('fc') || h.startsWith('fd')) return true;
  if (h.startsWith('::ffff:')) return isPrivateIpv4(h.slice(7));
  return false;
}

function isBlockedHost(host: string): boolean {
  if (BLOCKED_HOSTNAMES.has(host)) return true;
  if (host.endsWith('.local') || host.endsWith('.internal') || host.endsWith('.localhost')) {
    return true;
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) && isPrivateIpv4(host)) return true;
  if (host.includes(':') && isPrivateIpv6(host)) return true;
  return false;
}

export function assertSafeOutboundUrl(
  raw: string,
  options?: { httpsOnly?: boolean }
): { ok: true; url: string } | { ok: false; error: string } {
  const value = String(raw ?? '').trim();
  if (!value) return { ok: false, error: 'URL is required' };

  let parsed: URL;
  try {
    parsed = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return { ok: false, error: 'Invalid URL' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, error: 'Only HTTP(S) URLs are allowed' };
  }

  const httpsOnly = options?.httpsOnly ?? process.env.NODE_ENV === 'production';
  if (httpsOnly && parsed.protocol !== 'https:') {
    return { ok: false, error: 'HTTPS is required' };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, error: 'URLs with credentials are not allowed' };
  }

  const host = normalizeHost(parsed.hostname);
  if (isBlockedHost(host)) {
    return { ok: false, error: 'This URL is not allowed for security reasons' };
  }

  return { ok: true, url: parsed.toString() };
}

export function assertSafeIntegrationWebhookUrl(
  type: 'slack' | 'discord',
  raw: string
): { ok: true; url: string } | { ok: false; error: string } {
  const base = assertSafeOutboundUrl(raw, { httpsOnly: true });
  if (!base.ok) return base;

  const host = normalizeHost(new URL(base.url).hostname);
  if (type === 'slack') {
    if (host === 'hooks.slack.com' || host === 'hooks.slack-gov.com') {
      return base;
    }
    return { ok: false, error: 'Slack webhooks must use hooks.slack.com' };
  }

  if (
    (host === 'discord.com' || host === 'discordapp.com') &&
    new URL(base.url).pathname.startsWith('/api/webhooks/')
  ) {
    return base;
  }
  return { ok: false, error: 'Discord webhooks must use discord.com/api/webhooks/...' };
}
