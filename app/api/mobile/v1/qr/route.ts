export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticateMobileRequest, isMobileAuthError } from '@/lib/mobile-auth';
import { mobileScanUrl, serializeMobileQr } from '@/lib/mobile-serialize';
import { resolveApiWorkspaceId } from '@/lib/workspace';
import { parseApiBody } from '@/lib/api-serialize';
import { generateShortCode, buildQRPayload } from '@/lib/qr-utils';
import { stripMetaFields } from '@/lib/industry-templates';
import { normalizeLabels } from '@/lib/organize-utils';
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
  const auth = await authenticateMobileRequest(req);
  if (isMobileAuthError(auth)) return auth;

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '30', 10) || 30, 100);
  const offset = parseInt(req.nextUrl.searchParams.get('offset') ?? '0', 10) || 0;
  const q = req.nextUrl.searchParams.get('q')?.trim();
  const folderId = req.nextUrl.searchParams.get('folder_id') ?? req.nextUrl.searchParams.get('folderId');
  const workspaceParam = req.nextUrl.searchParams.get('workspace_id') ?? req.nextUrl.searchParams.get('workspaceId');

  const ws = await resolveApiWorkspaceId(auth.userId, workspaceParam, 'viewer');
  if (!ws.ok) {
    return NextResponse.json({ error: ws.error }, { status: 403, headers: auth.rateLimitHeaders });
  }

  const where: Prisma.QRCodeWhereInput = { workspaceId: ws.workspaceId };
  if (folderId) where.folderId = folderId;
  if (req.nextUrl.searchParams.get('unfiled') === '1') where.folderId = null;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { shortCode: { contains: q, mode: 'insensitive' } },
    ];
  }

  const items = await prisma.qRCode.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    take: limit,
    skip: offset,
    include: { folder: { select: { name: true } } },
  });

  const scanBase = await mobileScanUrl(auth.userId, items[0]?.shortCode ?? 'x');
  const basePrefix = scanBase.replace(/\/s\/[^/]+$/, '');

  const data = items.map((qr) => serializeMobileQr(qr, `${basePrefix}/s/${qr.shortCode}`));
  const total = await prisma.qRCode.count({ where });

  return NextResponse.json(
    { data, pagination: { total, limit, offset, count: data.length } },
    { headers: auth.rateLimitHeaders },
  );
}

export async function POST(req: NextRequest) {
  const auth = await authenticateMobileRequest(req);
  if (isMobileAuthError(auth)) return auth;

  try {
    const body = await req.json();
    const parsed = parseApiBody(body);
    if (!parsed.name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400, headers: auth.rateLimitHeaders });
    }
    if (!parsed.category?.trim()) {
      return NextResponse.json({ error: 'category is required' }, { status: 400, headers: auth.rateLimitHeaders });
    }

    const workspaceParam =
      (body.workspace_id as string | undefined) ?? (body.workspaceId as string | undefined);
    const ws = await resolveApiWorkspaceId(auth.userId, workspaceParam, 'editor');
    if (!ws.ok) {
      return NextResponse.json({ error: ws.error }, { status: 403, headers: auth.rateLimitHeaders });
    }

    const qrData = stripMetaFields({ ...(parsed.qrData ?? {}) } as Record<string, string>);
    if (parsed.url && parsed.category === 'url') qrData.url = parsed.url;

    const targetUrl = buildQRPayload(parsed.category, qrData);
    if (!targetUrl?.trim()) {
      return NextResponse.json(
        { error: 'qr_data or url is required for this category' },
        { status: 400, headers: auth.rateLimitHeaders },
      );
    }

    const urlCheck = assertQrUrlsAllowed(parsed.category, qrData);
    if (!urlCheck.ok) {
      return NextResponse.json({ error: urlCheck.error }, { status: 400, headers: auth.rateLimitHeaders });
    }

    const planCheck = await assertCanCreateQr(auth.userId);
    if (!planCheck.ok) {
      return NextResponse.json({ error: planCheck.error }, { status: 403, headers: auth.rateLimitHeaders });
    }

    if (parsed.folderId) {
      const folder = await prisma.qRFolder.findFirst({
        where: { id: parsed.folderId, userId: auth.userId },
      });
      if (!folder) {
        return NextResponse.json({ error: 'folder_id not found' }, { status: 400, headers: auth.rateLimitHeaders });
      }
    }

    const password = body.password as string | undefined;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const shortCode = await uniqueShortCode();

    const qrCode = await prisma.qRCode.create({
      data: {
        userId: auth.userId,
        workspaceId: ws.workspaceId,
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
      include: { folder: { select: { name: true } } },
    });

    const scanUrl = await mobileScanUrl(auth.userId, qrCode.shortCode);
    return NextResponse.json(
      { data: serializeMobileQr(qrCode, scanUrl) },
      { status: 201, headers: auth.rateLimitHeaders },
    );
  } catch (error) {
    console.error('Mobile v1 QR create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
