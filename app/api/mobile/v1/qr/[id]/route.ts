export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateMobileRequest, isMobileAuthError } from '@/lib/mobile-auth';
import { mobileScanUrl, serializeMobileQr } from '@/lib/mobile-serialize';
import { assertQrAccess } from '@/lib/workspace';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = await authenticateMobileRequest(req);
  if (isMobileAuthError(auth)) return auth;

  const { id } = await params;
  const access = await assertQrAccess(auth.userId, id, 'viewer');
  if (!access.ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const qr = await prisma.qRCode.findFirst({
    where: { id },
    include: { folder: { select: { name: true } } },
  });
  if (!qr) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [scanUrl, scans7d, recentScans] = await Promise.all([
    mobileScanUrl(auth.userId, qr.shortCode),
    prisma.qRScan.count({ where: { qrCodeId: qr.id, scannedAt: { gte: since7d } } }),
    prisma.qRScan.findMany({
      where: { qrCodeId: qr.id },
      orderBy: { scannedAt: 'desc' },
      take: 20,
      select: {
        id: true,
        scannedAt: true,
        country: true,
        city: true,
        device: true,
        browser: true,
        os: true,
        scanSource: true,
      },
    }),
  ]);

  return NextResponse.json(
    {
      qr: serializeMobileQr(qr, scanUrl),
      analytics: {
        scans7d,
        recentScans: recentScans.map((s) => ({
          ...s,
          scannedAt: s.scannedAt.toISOString(),
        })),
      },
    },
    { headers: auth.rateLimitHeaders }
  );
}
