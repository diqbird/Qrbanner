export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getStudioDeliveryForResend } from '@/lib/studio-entitlement';
import { resolveStudioDeliveryLocale } from '@/lib/studio-delivery-locale';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';
import { sendStudioDeliveryEmail } from '@/lib/email';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;
  const adminId = auth;

  const id = params.id?.trim();
  if (!id) return NextResponse.json({ error: 'invalid_id' }, { status: 400 });

  const check = await getStudioDeliveryForResend(id);
  if (!check.ok) {
    const status = check.code === 'not_found' ? 404 : 409;
    return NextResponse.json({ error: check.code }, { status });
  }

  const locale = resolveStudioDeliveryLocale(check.row.notes);

  try {
    const emailResult = await sendStudioDeliveryEmail(
      check.row.buyerEmail,
      {
        url: check.url,
        maxQr: check.row.maxQr,
        buyerEmail: check.row.buyerEmail,
      },
      locale,
      adminId,
    );

    const actor = await getAdminActorContext(adminId, req);
    await recordAdminAudit({
      ...actor,
      action: 'studio.etsy_resend_email',
      targetType: 'studio_entitlement',
      targetId: check.row.id,
      summary: `${check.row.buyerEmail} · resend ${emailResult.sent ? 'sent' : 'fallback'}`,
    });

    return NextResponse.json({
      ok: true,
      url: check.url,
      emailSent: emailResult.sent,
      emailFallback: emailResult.fallback ?? false,
    });
  } catch (err) {
    console.error('[admin/studio/etsy/resend] email failed:', err);
    return NextResponse.json(
      { error: 'email_failed', url: check.url },
      { status: 502 },
    );
  }
}
