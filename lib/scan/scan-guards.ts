import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getVerifiedDomainByHost, isAppHost } from '@/lib/custom-domain';
import { htmlPage } from '@/lib/scan/scan-html';
import { resolveScanPageCopy } from '@/lib/i18n/resolve-scan-page-copy';
import type { Locale } from '@/lib/i18n/types';
import type { ScanQrCode } from '@/lib/scan/scan-log';

type QR = Awaited<ReturnType<typeof prisma.qRCode.findUnique>>;

export function runGuards(qrCode: QR, locale: Locale = 'en'): NextResponse | null {
  const c = resolveScanPageCopy(locale);
  if (!qrCode || !qrCode.isActive) {
    return htmlPage(c.notFoundTitle, c.notFoundDesc, 404, c);
  }
  if (qrCode.expiresAt && new Date() > qrCode.expiresAt) {
    return htmlPage(c.expiredTitle, c.expiredDesc, 410, c);
  }
  if (qrCode.scanLimit != null && qrCode.totalScans >= qrCode.scanLimit) {
    return htmlPage(c.scanLimitTitle, c.scanLimitDesc, 410, c);
  }
  return null;
}

export async function assertCustomDomainAccess(
  req: NextRequest,
  qrCode: ScanQrCode,
  locale: Locale = 'en'
): Promise<NextResponse | null> {
  const c = resolveScanPageCopy(locale);
  const host = req.headers.get('host');
  if (isAppHost(host)) return null;

  const verified = await getVerifiedDomainByHost(host ?? '');
  if (!verified) {
    return htmlPage(c.domainNotVerifiedTitle, c.domainNotVerifiedDesc, 404, c);
  }
  if (verified.userId !== qrCode.userId) {
    return htmlPage(c.notFoundTitle, c.domainNotFoundDesc, 404, c);
  }
  return null;
}
