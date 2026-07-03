export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { authenticateApiRequest, isAuthError, apiError, apiSuccess } from '@/lib/api-auth';
import { serializeQRForUser, parseApiBody } from '@/lib/api-serialize';
import { generateShortCode, buildQRPayload } from '@/lib/qr-utils';
import { stripMetaFields } from '@/lib/industry-templates';
import { normalizeLabels } from '@/lib/organize-utils';
import { getPrimaryScanBaseUrl } from '@/lib/custom-domain';
import { assertCanCreateQr } from '@/lib/plan-usage';
import { assertQrUrlsAllowed } from '@/lib/validate-qr-urls';

async function uniqueShortCode(): Promise<string> {
  for (let i = 0; i < 15; i++) {
    const shortCode = generateShortCode();
    const exists = await prisma.qRCode.findUnique({ where: { shortCode }, select: { id: true } });
    if (!exists) return shortCode;
  }
  throw new Error('Could not generate short code');
}

export async function GET(req: NextRequest) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('folder_id') ?? searchParams.get('folderId');
    const label = searchParams.get('label');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10) || 50, 100);
    const offset = parseInt(searchParams.get('offset') ?? '0', 10) || 0;

    const where: Record<string, unknown> = { userId: auth.userId };
    if (folderId) where.folderId = folderId;
    if (searchParams.get('unfiled') === '1') where.folderId = null;

    let items = await prisma.qRCode.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: { folder: { select: { id: true, name: true, color: true } } },
    });

    if (label?.trim()) {
      const needle = label.trim().toLowerCase();
      items = items.filter((qr) =>
        normalizeLabels(qr.labels).some((l) => l.toLowerCase() === needle)
      );
    }

    const total = await prisma.qRCode.count({ where: where as any });

    const scanBase = await getPrimaryScanBaseUrl(auth.userId);

    return apiSuccess({
      data: await Promise.all(items.map((qr) => serializeQRForUser({ ...qr, userId: auth.userId }, scanBase))),
      pagination: { total, limit, offset, count: items.length },
    }, 200, auth.rateLimitHeaders);
  } catch (error) {
    console.error('API v1 QR list error:', error);
    return apiError('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json();
    const parsed = parseApiBody(body);

    if (!parsed.name?.trim()) return apiError('name is required', 400);
    if (!parsed.category?.trim()) return apiError('category is required', 400);

    const qrData = stripMetaFields({ ...(parsed.qrData ?? {}) } as Record<string, string>);
    if (parsed.url && parsed.category === 'url') {
      qrData.url = parsed.url;
    }

    const targetUrl = buildQRPayload(parsed.category, qrData);
    if (!targetUrl?.trim()) return apiError('qr_data or url is required for this category', 400);

    const urlCheck = assertQrUrlsAllowed(parsed.category, qrData);
    if (!urlCheck.ok) return apiError(urlCheck.error, 400);

    const planCheck = await assertCanCreateQr(auth.userId);
    if (!planCheck.ok) {
      return apiError(planCheck.error, 403);
    }

    if (parsed.folderId) {
      const folder = await prisma.qRFolder.findFirst({
        where: { id: parsed.folderId, userId: auth.userId },
      });
      if (!folder) return apiError('folder_id not found', 400);
    }

    const password = body.password as string | undefined;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const shortCode = await uniqueShortCode();
    const qrCode = await prisma.qRCode.create({
      data: {
        userId: auth.userId,
        name: parsed.name.trim(),
        shortCode,
        category: parsed.category,
        targetUrl,
        qrData,
        style: (parsed.style ?? {}) as object,
        folderId: parsed.folderId || null,
        labels: normalizeLabels(parsed.labels ?? []),
        password: hashedPassword,
        isActive: parsed.isActive !== false,
      },
      include: { folder: { select: { id: true, name: true, color: true } } },
    });

    return apiSuccess({ data: await serializeQRForUser({ ...qrCode, userId: auth.userId }) }, 201, auth.rateLimitHeaders);
  } catch (error) {
    console.error('API v1 QR create error:', error);
    return apiError('Internal server error', 500);
  }
}
