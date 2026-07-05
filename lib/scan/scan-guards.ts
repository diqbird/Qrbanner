import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getVerifiedDomainByHost, isAppHost } from '@/lib/custom-domain';
import { htmlPage } from '@/lib/scan/scan-html';
import type { ScanQrCode } from '@/lib/scan/scan-log';

type QR = Awaited<ReturnType<typeof prisma.qRCode.findUnique>>;

export function runGuards(qrCode: QR): NextResponse | null {
  if (!qrCode || !qrCode.isActive) {
    return htmlPage('QR Code Not Found', 'This QR code is inactive or does not exist.', 404);
  }
  if (qrCode.expiresAt && new Date() > qrCode.expiresAt) {
    return htmlPage('QR Code Expired', 'This QR code has expired and is no longer available.', 410);
  }
  if (qrCode.scanLimit != null && qrCode.totalScans >= qrCode.scanLimit) {
    return htmlPage('Scan Limit Reached', 'This QR code has reached its maximum number of scans.', 410);
  }
  return null;
}

export async function assertCustomDomainAccess(
  req: NextRequest,
  qrCode: ScanQrCode
): Promise<NextResponse | null> {
  const host = req.headers.get('host');
  if (isAppHost(host)) return null;

  const verified = await getVerifiedDomainByHost(host ?? '');
  if (!verified) {
    return htmlPage(
      'Domain Not Verified',
      'This custom domain is not verified yet. Complete DNS setup in your QRbanner settings.',
      404
    );
  }
  if (verified.userId !== qrCode.userId) {
    return htmlPage('QR Code Not Found', 'This QR code is not available on this domain.', 404);
  }
  return null;
}
