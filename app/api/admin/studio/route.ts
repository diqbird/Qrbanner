export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createStudioEntitlement,
  normalizeStudioEmail,
  studioPublicUrl,
} from '@/lib/studio-entitlement';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';
import { prisma } from '@/lib/db';

const createSchema = z.object({
  buyerEmail: z.string().email(),
  maxQr: z.number().int().min(1).max(20).default(1),
  externalOrderId: z.string().max(120).optional(),
  expiresInDays: z.number().int().min(1).max(730).optional(),
  notes: z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const status = req.nextUrl.searchParams.get('status');
  const where = status && status !== 'all' ? { status } : {};

  const items = await prisma.studioEntitlement.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });

  return NextResponse.json({
    items: items.map((row) => ({
      id: row.id,
      token: row.token,
      buyerEmail: row.buyerEmail,
      maxQr: row.maxQr,
      qrRemaining: row.qrRemaining,
      status: row.status,
      source: row.source,
      externalOrderId: row.externalOrderId,
      notes: row.notes,
      claimedAt: row.claimedAt?.toISOString() ?? null,
      expiresAt: row.expiresAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      url: studioPublicUrl(row.token),
      user: row.user,
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;
  const adminId = auth;

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const expiresAt = parsed.data.expiresInDays
    ? new Date(Date.now() + parsed.data.expiresInDays * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const row = await createStudioEntitlement({
    buyerEmail: normalizeStudioEmail(parsed.data.buyerEmail),
    maxQr: parsed.data.maxQr,
    externalOrderId: parsed.data.externalOrderId,
    expiresAt,
    notes: parsed.data.notes,
  });

  const actor = await getAdminActorContext(adminId, req);
  await recordAdminAudit({
    ...actor,
    action: 'studio.entitlement_create',
    targetType: 'studio_entitlement',
    targetId: row.id,
    summary: `${row.buyerEmail} · ${row.maxQr} QR`,
  });

  return NextResponse.json({
    ok: true,
    id: row.id,
    token: row.token,
    url: studioPublicUrl(row.token),
  });
}
