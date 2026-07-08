export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';

export async function GET(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const status = req.nextUrl.searchParams.get('status');
  const where = status && status !== 'all' ? { status } : {};

  const [items, openCount, total] = await Promise.all([
    prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.contactInquiry.count({ where: { status: 'open' } }),
    prisma.contactInquiry.count(),
  ]);

  return NextResponse.json({ items, openCount, total });
}

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['open', 'in_progress', 'closed']),
});

export async function PATCH(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;
  const adminId = auth;

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const inquiry = await prisma.contactInquiry.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status },
  });

  const actor = await getAdminActorContext(adminId, req);
  await recordAdminAudit({
    ...actor,
    action: 'support.inquiry_status',
    targetType: 'contact_inquiry',
    targetId: inquiry.id,
    summary: `${inquiry.email} → ${parsed.data.status}`,
  });

  return NextResponse.json({ ok: true, inquiry });
}
