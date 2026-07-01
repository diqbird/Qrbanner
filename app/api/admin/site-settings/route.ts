export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUserId } from '@/lib/admin-auth';
import { getSiteSettings, writeSiteSettings } from '@/lib/site-settings-server';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';

export async function GET() {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  return NextResponse.json(getSiteSettings());
}

export async function PATCH(req: NextRequest) {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const patch: { showQrDescription?: boolean } = {};

  if ('showQrDescription' in record) {
    if (typeof record.showQrDescription !== 'boolean') {
      return NextResponse.json({ error: 'invalid_show_qr_description' }, { status: 400 });
    }
    patch.showQrDescription = record.showQrDescription;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'no_changes' }, { status: 400 });
  }

  const settings = writeSiteSettings(patch);
  const actor = await getAdminActorContext(adminId, req);
  await recordAdminAudit({
    ...actor,
    action: 'site_settings.update',
    targetType: 'site_settings',
    summary: Object.keys(patch).join(', '),
    metadata: patch,
  });
  return NextResponse.json(settings);
}
