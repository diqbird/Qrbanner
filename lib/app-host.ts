/** Edge-safe host helpers — no Node-only imports (dns, prisma). */

export const CNAME_TARGET = process.env.CUSTOM_DOMAIN_CNAME_TARGET || 'qrbanner.com';
export const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://qrbanner.com';

const APP_HOSTS = new Set(
  [
    'qrbanner.com',
    'www.qrbanner.com',
    'localhost',
    '127.0.0.1',
    process.env.CUSTOM_DOMAIN_SERVER_IP,
    process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
  ]
    .filter(Boolean)
    .map((h) => String(h).toLowerCase())
);

export function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '')
    .replace(/\.$/, '');
}

export function isAppHost(host: string | null | undefined): boolean {
  if (!host) return true;
  const normalized = normalizeDomain(host.split(':')[0]);
  return APP_HOSTS.has(normalized);
}
