import { prisma } from '@/lib/db';

export interface PublicPlatformStats {
  qrCodes: number;
  scans: number;
  users: number;
}

function roundForDisplay(n: number): number {
  if (n < 100) return n;
  if (n < 1000) return Math.floor(n / 10) * 10;
  if (n < 10000) return Math.floor(n / 100) * 100;
  return Math.floor(n / 1000) * 1000;
}

/**
 * Hide tiny counts on marketing pages — they hurt trust more than they help.
 * Thresholds are intentionally modest so early production can still show real traction.
 */
export const PUBLIC_STATS_MIN_QR_CODES = 25;
export const PUBLIC_STATS_MIN_SCANS = 100;
export const PUBLIC_STATS_MIN_USERS = 10;

export function shouldDisplayPublicStats(stats: PublicPlatformStats): boolean {
  return (
    stats.qrCodes >= PUBLIC_STATS_MIN_QR_CODES ||
    stats.scans >= PUBLIC_STATS_MIN_SCANS ||
    stats.users >= PUBLIC_STATS_MIN_USERS
  );
}

export async function getPublicPlatformStats(): Promise<PublicPlatformStats> {
  try {
    const [qrCodes, scans, users] = await Promise.all([
      prisma.qRCode.count(),
      prisma.qRScan.count(),
      prisma.user.count(),
    ]);
    return {
      qrCodes: roundForDisplay(qrCodes),
      scans: roundForDisplay(scans),
      users: roundForDisplay(users),
    };
  } catch {
    return { qrCodes: 0, scans: 0, users: 0 };
  }
}
