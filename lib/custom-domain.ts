import crypto from 'crypto';
import { promises as dns } from 'dns';
import { prisma } from '@/lib/db';

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

export function generateVerifyToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function txtRecordName(domain: string): string {
  return `_qrbanner.${domain}`;
}

export function txtRecordValue(token: string): string {
  return `qrbanner-verify=${token}`;
}

export async function verifyDomainDns(
  domain: string,
  token: string
): Promise<{ ok: boolean; reason?: string }> {
  const txtHost = txtRecordName(domain);
  const expected = txtRecordValue(token);

  try {
    const txtRecords = await dns.resolveTxt(txtHost);
    const flat = txtRecords.map((parts) => parts.join(''));
    if (flat.some((r) => r.includes(expected))) {
      return { ok: true };
    }
  } catch {
    /* TXT not found yet */
  }

  try {
    const cnames = await dns.resolveCname(domain);
    const target = CNAME_TARGET.toLowerCase();
    const cnameOk = cnames.some(
      (c) => normalizeDomain(c) === target || normalizeDomain(c).endsWith(`.${target}`)
    );
    if (!cnameOk) {
      return {
        ok: false,
        reason: `CNAME must point to ${CNAME_TARGET}. TXT verification record is also required.`,
      };
    }
  } catch {
    return {
      ok: false,
      reason: `Add a CNAME record pointing to ${CNAME_TARGET}, then add the TXT verification record.`,
    };
  }

  return {
    ok: false,
    reason: `TXT record not found at ${txtHost}. Add: ${expected}`,
  };
}

export async function getVerifiedDomainByHost(host: string) {
  const domain = normalizeDomain(host.split(':')[0]);
  if (isAppHost(domain)) return null;

  return prisma.customDomain.findFirst({
    where: { domain, status: 'verified' },
    select: { id: true, userId: true, domain: true, isPrimary: true },
  });
}

export async function getPrimaryScanBaseUrl(userId: string): Promise<string> {
  const primary = await prisma.customDomain.findFirst({
    where: { userId, status: 'verified', isPrimary: true },
    select: { domain: true },
  });

  if (primary) {
    return `https://${primary.domain}`;
  }

  return DEFAULT_SITE_URL.replace(/\/$/, '');
}

export function buildScanUrl(shortCode: string, baseUrl?: string): string {
  const base = (baseUrl || DEFAULT_SITE_URL).replace(/\/$/, '');
  return `${base}/s/${shortCode}`;
}

export async function setPrimaryDomain(userId: string, domainId: string) {
  await prisma.$transaction([
    prisma.customDomain.updateMany({
      where: { userId },
      data: { isPrimary: false },
    }),
    prisma.customDomain.updateMany({
      where: { id: domainId, userId, status: 'verified' },
      data: { isPrimary: true },
    }),
  ]);
}
