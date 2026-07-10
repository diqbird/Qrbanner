export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  approveAndSendStudioDelivery,
  normalizeStudioEmail,
  registerEtsyStudioOrder,
  studioPublicUrl,
} from '@/lib/studio-entitlement';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';
import { sendStudioDeliveryEmail } from '@/lib/email';
import { prisma } from '@/lib/db';

const registerSchema = z.object({
  buyerEmail: z.string().email(),
  externalOrderId: z.string().max(120).optional(),
  notes: z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const status = req.nextUrl.searchParams.get('status') ?? 'awaiting_approval';

  const items = await prisma.studioEntitlement.findMany({
    where: {
      source: 'etsy',
      ...(status !== 'all' ? { deliveryStatus: status } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });

  return NextResponse.json({
    items: items.map((row) => ({
      id: row.id,
      buyerEmail: row.buyerEmail,
      maxQr: row.maxQr,
      qrRemaining: row.qrRemaining,
      status: row.status,
      deliveryStatus: row.deliveryStatus,
      externalOrderId: row.externalOrderId,
      notes: row.notes,
      sentAt: row.sentAt?.toISOString() ?? null,
      approvedAt: row.approvedAt?.toISOString() ?? null,
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

  const parsed = registerSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const row = await registerEtsyStudioOrder({
    buyerEmail: normalizeStudioEmail(parsed.data.buyerEmail),
    externalOrderId: parsed.data.externalOrderId,
    notes: parsed.data.notes,
    maxQr: 5,
  });

  const actor = await getAdminActorContext(adminId, req);
  await recordAdminAudit({
    ...actor,
    action: 'studio.etsy_register',
    targetType: 'studio_entitlement',
    targetId: row.id,
    summary: `Etsy queue · ${row.buyerEmail}`,
  });

  return NextResponse.json({
    ok: true,
    id: row.id,
    deliveryStatus: row.deliveryStatus,
    url: studioPublicUrl(row.token),
  });
}
