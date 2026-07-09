export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';

const patchSchema = z.object({
  status: z.enum(['revoked']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;
  const adminId = auth;

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const row = await prisma.studioEntitlement.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  const actor = await getAdminActorContext(adminId, req);
  await recordAdminAudit({
    ...actor,
    action: 'studio.entitlement_revoke',
    targetType: 'studio_entitlement',
    targetId: row.id,
    summary: row.buyerEmail,
  });

  return NextResponse.json({ ok: true });
}
