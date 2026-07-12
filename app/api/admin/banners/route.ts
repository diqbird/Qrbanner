export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { getSiteSettings, writeSiteSettings } from '@/lib/site-settings-server';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';

function bannerPayload(settings: ReturnType<typeof getSiteSettings>) {
  return {
    announcementEnabled: settings.announcementEnabled,
    announcementText: settings.announcementText,
    announcementTextTr: settings.announcementTextTr,
    announcementTextDe: settings.announcementTextDe,
    announcementTextEs: settings.announcementTextEs,
    announcementLink: settings.announcementLink,
  };
}

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  return NextResponse.json(bannerPayload(getSiteSettings()));
}

const patchSchema = z.object({
  announcementEnabled: z.boolean().optional(),
  announcementText: z.string().max(200).optional(),
  announcementTextTr: z.string().max(200).optional(),
  announcementTextDe: z.string().max(200).optional(),
  announcementTextEs: z.string().max(200).optional(),
  announcementLink: z
    .string()
    .max(300)
    .refine((v) => v === '' || v.startsWith('/') || v.startsWith('https://'), 'invalid_link')
    .optional(),
});

export async function PATCH(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;
  const adminId = auth;

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: 'no_changes' }, { status: 400 });
  }

  const settings = writeSiteSettings(parsed.data);

  const actor = await getAdminActorContext(adminId, req);
  await recordAdminAudit({
    ...actor,
    action: 'banners.announcement_update',
    targetType: 'site_settings',
    summary: Object.keys(parsed.data).join(', '),
    metadata: parsed.data,
  });

  return NextResponse.json(bannerPayload(settings));
}
