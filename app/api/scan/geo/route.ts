export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { enforcePublicRateLimit } from '@/lib/public-rate-limit';

export async function POST(req: NextRequest) {
  try {
    const limited = await enforcePublicRateLimit(req, 'scan-geo', 60, 15 * 60 * 1000);
    if (limited) return limited;

    const body = await req.json();
    const shortCode = String(body.shortCode ?? '').trim();
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);

    if (!shortCode || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const qrCode = await prisma.qRCode.findUnique({ where: { shortCode } });
    if (!qrCode?.gpsHeatmapEnabled) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const recent = await prisma.qRScan.findFirst({
      where: {
        qrCodeId: qrCode.id,
        scannedAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      },
      orderBy: { scannedAt: 'desc' },
    });

    if (recent) {
      await prisma.qRScan.update({
        where: { id: recent.id },
        data: { latitude, longitude },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('GPS capture error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
