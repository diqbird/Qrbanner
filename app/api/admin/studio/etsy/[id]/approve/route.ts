export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { approveAndSendStudioDelivery } from '@/lib/studio-entitlement';
import { resolveStudioDeliveryLocale } from '@/lib/studio-delivery-locale';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';
import { sendStudioDeliveryEmail } from '@/lib/email';
import { prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;
  const adminId = auth;

  const id = params.id?.trim();
  if (!id) return NextResponse.json({ error: 'invalid_id' }, { status: 400 });

  const approved = await approveAndSendStudioDelivery(id);
  if (!approved.ok) {
    const status = approved.code === 'not_found' ? 404 : 409;
    return NextResponse.json({ error: approved.code }, { status });
  }

  const row = await prisma.studioEntitlement.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  let emailResult: { sent: boolean; fallback?: boolean } = { sent: false };
  try {
    emailResult = await sendStudioDeliveryEmail(
      row.buyerEmail,
      {
        url: approved.url,
        maxQr: row.maxQr,
        buyerEmail: row.buyerEmail,
      },
      resolveStudioDeliveryLocale(row.notes),
      adminId,
    );
  } catch (err) {
    console.error('[admin/studio/etsy/approve] email failed:', err);
    return NextResponse.json(
      { error: 'email_failed', url: approved.url, approved: true },
      { status: 502 },
    );
  }

  const actor = await getAdminActorContext(adminId, req);
  await recordAdminAudit({
    ...actor,
    action: 'studio.etsy_approve_send',
    targetType: 'studio_entitlement',
    targetId: row.id,
    summary: `${row.buyerEmail} · email ${emailResult.sent ? 'sent' : 'fallback'}`,
  });

  return NextResponse.json({
    ok: true,
    url: approved.url,
    emailSent: emailResult.sent,
    emailFallback: emailResult.fallback ?? false,
  });
}
