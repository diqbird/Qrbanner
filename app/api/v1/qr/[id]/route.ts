export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { authenticateApiRequest, isAuthError, apiError, apiSuccess } from '@/lib/api-auth';
import { serializeQRForUser, parseApiBody } from '@/lib/api-serialize';
import { buildQRPayload } from '@/lib/qr-utils';
import { stripMetaFields } from '@/lib/industry-templates';
import { normalizeLabels } from '@/lib/organize-utils';
import { invalidateScanQrCache } from '@/lib/scan-redirect-cache';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const qrCode = await prisma.qRCode.findFirst({
      where: { id: params.id, userId: auth.userId },
      include: { folder: { select: { id: true, name: true, color: true } } },
    });

    if (!qrCode) return apiError('QR code not found', 404, auth.rateLimitHeaders);
    return apiSuccess({ data: await serializeQRForUser({ ...qrCode, userId: auth.userId }) }, 200, auth.rateLimitHeaders);
  } catch (error) {
    console.error('API v1 QR get error:', error);
    return apiError('Internal server error', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const existing = await prisma.qRCode.findFirst({
      where: { id: params.id, userId: auth.userId },
    });
    if (!existing) return apiError('QR code not found', 404);

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
        if (!folder) return apiError('folder_id not found', 400);
      }
      updateData.folderId = parsed.folderId || null;
    }

    if (parsed.labels !== undefined) updateData.labels = normalizeLabels(parsed.labels);

    if (body.password !== undefined) {
      const pw = body.password as string | null;
      updateData.password = pw ? await bcrypt.hash(pw, 10) : null;
    }

    const updated = await prisma.qRCode.update({
      where: { id: params.id },
      data: updateData,
      include: { folder: { select: { id: true, name: true, color: true } } },
    });

    await invalidateScanQrCache(existing.shortCode);

    return apiSuccess({ data: await serializeQRForUser({ ...updated, userId: auth.userId }) }, 200, auth.rateLimitHeaders);
  } catch (error) {
    console.error('API v1 QR update error:', error);
    return apiError('Internal server error', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const existing = await prisma.qRCode.findFirst({
      where: { id: params.id, userId: auth.userId },
    });
    if (!existing) return apiError('QR code not found', 404);

    await invalidateScanQrCache(existing.shortCode);
    await prisma.qRCode.delete({ where: { id: params.id } });
    return apiSuccess({ message: 'QR code deleted' }, 200, auth.rateLimitHeaders);
  } catch (error) {
    console.error('API v1 QR delete error:', error);
    return apiError('Internal server error', 500);
  }
}
