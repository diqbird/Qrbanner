export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { authenticateMobileRequest, isMobileAuthError } from '@/lib/mobile-auth';
import { mobileScanUrl, serializeMobileQr } from '@/lib/mobile-serialize';
import { assertQrAccess } from '@/lib/workspace';
import { parseApiBody } from '@/lib/api-serialize';
import { buildQRPayload } from '@/lib/qr-utils';
import { stripMetaFields } from '@/lib/industry-templates';
import { normalizeLabels } from '@/lib/organize-utils';
import { invalidateScanQrCache } from '@/lib/scan-redirect-cache';

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
    { headers: auth.rateLimitHeaders },
  );
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = await authenticateMobileRequest(req);
  if (isMobileAuthError(auth)) return auth;

  const { id } = await params;
  const access = await assertQrAccess(auth.userId, id, 'editor');
  if (!access.ok) {
    return NextResponse.json({ error: 'not_found' }, { status: 404, headers: auth.rateLimitHeaders });
  }

  try {
    const existing = access.qr;
    const body = await req.json();
    const parsed = parseApiBody(body);
    const updateData: Record<string, unknown> = {};

    if (parsed.name !== undefined) updateData.name = parsed.name.trim();
    if (parsed.isActive !== undefined) updateData.isActive = Boolean(parsed.isActive);

    if (parsed.qrData !== undefined || parsed.url !== undefined) {
      const qrData = stripMetaFields({
        ...(parsed.qrData ?? (existing.qrData as object)),
        ...(parsed.url ? { url: parsed.url } : {}),
      } as Record<string, string>);
      updateData.qrData = qrData;
      updateData.targetUrl = buildQRPayload(existing.category, qrData);
    }

    if (parsed.style !== undefined) updateData.style = parsed.style;

    if (parsed.folderId !== undefined) {
      if (parsed.folderId) {
        const folder = await prisma.qRFolder.findFirst({
          where: { id: parsed.folderId, userId: auth.userId },
        });
        if (!folder) {
          return NextResponse.json({ error: 'folder_id not found' }, { status: 400, headers: auth.rateLimitHeaders });
        }
      }
      updateData.folderId = parsed.folderId || null;
    }

    if (parsed.labels !== undefined) updateData.labels = normalizeLabels(parsed.labels);

    if (body.password !== undefined) {
      const pw = body.password as string | null;
      updateData.password = pw ? await bcrypt.hash(pw, 10) : null;
    }

    const updated = await prisma.qRCode.update({
      where: { id },
      data: updateData,
      include: { folder: { select: { name: true } } },
    });

    await invalidateScanQrCache(existing.shortCode);
    const scanUrl = await mobileScanUrl(auth.userId, updated.shortCode);
    return NextResponse.json(
      { data: serializeMobileQr(updated, scanUrl) },
      { headers: auth.rateLimitHeaders },
    );
  } catch (error) {
    console.error('Mobile v1 QR update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const auth = await authenticateMobileRequest(req);
  if (isMobileAuthError(auth)) return auth;

  const { id } = await params;
  const access = await assertQrAccess(auth.userId, id, 'editor');
  if (!access.ok) {
    return NextResponse.json({ error: 'not_found' }, { status: 404, headers: auth.rateLimitHeaders });
  }

  try {
    await invalidateScanQrCache(access.qr.shortCode);
    await prisma.qRCode.delete({ where: { id } });
    return NextResponse.json({ message: 'QR code deleted' }, { headers: auth.rateLimitHeaders });
  } catch (error) {
    console.error('Mobile v1 QR delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
