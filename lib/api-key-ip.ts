/** Optional API-key IP allowlist helpers (IPv4 + exact IPv6). */

const MAX_ENTRIES = 32;
const IPV4_RE =
  /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})$/;

export function parseStoredIpAllowlist(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is string => typeof x === 'string')
    .map((s) => s.trim())
    .filter(Boolean);
}

function ipv4ToInt(ip: string): number | null {
  if (!IPV4_RE.test(ip)) return null;
  const parts = ip.split('.').map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  return ((parts[0]! << 24) >>> 0) + (parts[1]! << 16) + (parts[2]! << 8) + parts[3]!;
}

function normalizeIpv6(ip: string): string | null {
  const trimmed = ip.trim().toLowerCase();
  if (!trimmed.includes(':')) return null;
  // Expand :: once
  if ((trimmed.match(/::/g) || []).length > 1) return null;
  let full = trimmed;
  if (trimmed.includes('::')) {
    const [left = '', right = ''] = trimmed.split('::');
    const leftParts = left ? left.split(':') : [];
    const rightParts = right ? right.split(':') : [];
    const missing = 8 - leftParts.length - rightParts.length;
    if (missing < 0) return null;
    full = [...leftParts, ...Array(missing).fill('0'), ...rightParts].join(':');
  }
  const parts = full.split(':');
  if (parts.length !== 8) return null;
  if (parts.some((p) => !/^[0-9a-f]{1,4}$/.test(p))) return null;
  return parts.map((p) => p.padStart(4, '0')).join(':');
}

export function isValidAllowlistEntry(entry: string): boolean {
  const s = entry.trim();
  if (!s) return false;
  if (s.includes('/')) {
    const [ip, prefixStr] = s.split('/');
    if (!ip || prefixStr === undefined) return false;
    const prefix = Number(prefixStr);
    if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return false;
    return ipv4ToInt(ip) !== null;
  }
  if (IPV4_RE.test(s)) return true;
  return normalizeIpv6(s) !== null;
}

/** Normalize + validate a list from the client. Empty = unrestricted. */
export function normalizeIpAllowlistInput(raw: unknown): { ok: true; entries: string[] } | { ok: false; error: string } {
  if (raw == null) return { ok: true, entries: [] };
  let list: string[];
  if (typeof raw === 'string') {
    list = raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (Array.isArray(raw)) {
    list = raw
      .filter((x): x is string => typeof x === 'string')
      .map((s) => s.trim())
      .filter(Boolean);
  } else {
    return { ok: false, error: 'invalid_ip_allowlist' };
  }

  if (list.length > MAX_ENTRIES) return { ok: false, error: 'ip_allowlist_too_long' };

  const seen = new Set<string>();
  const entries: string[] = [];
  for (const item of list) {
    if (!isValidAllowlistEntry(item)) return { ok: false, error: 'invalid_ip_allowlist' };
    const key = item.includes(':') ? normalizeIpv6(item.split('/')[0]!) ?? item.toLowerCase() : item;
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push(item.includes('/') ? item : item.includes(':') ? (normalizeIpv6(item) ?? item) : item);
  }
  return { ok: true, entries };
}

function ipv4MatchesCidr(ip: string, cidr: string): boolean {
  const [base, prefixStr] = cidr.split('/');
  if (!base || prefixStr === undefined) return false;
  const prefix = Number(prefixStr);
  const ipInt = ipv4ToInt(ip);
  const baseInt = ipv4ToInt(base);
  if (ipInt === null || baseInt === null || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    return false;
  }
  if (prefix === 0) return true;
  const mask = prefix === 32 ? 0xffffffff : (~((1 << (32 - prefix)) - 1)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

export function isIpAllowed(clientAddress: string, allowlist: unknown): boolean {
  const entries = parseStoredIpAllowlist(allowlist);
  if (entries.length === 0) return true;

  const ip = clientAddress.trim();
  if (!ip || ip === 'unknown') return false;

  const ipv6 = normalizeIpv6(ip);
  const isV4 = ipv4ToInt(ip) !== null;

  for (const entry of entries) {
    if (entry.includes('/')) {
      if (isV4 && ipv4MatchesCidr(ip, entry)) return true;
      continue;
    }
    if (isV4 && entry === ip) return true;
    if (ipv6) {
      const entryV6 = normalizeIpv6(entry);
      if (entryV6 && entryV6 === ipv6) return true;
    }
  }
  return false;
}

export { MAX_ENTRIES as API_KEY_IP_ALLOWLIST_MAX };
