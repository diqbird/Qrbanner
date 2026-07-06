export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseBrandingSettings } from '@/lib/referral';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import type { Locale } from '@/lib/i18n/types';

export async function PATCH(req: Request) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const body = await req.json();
    const preferredLocale: Locale | undefined =
      body.preferredLocale === 'tr' ? 'tr' : body.preferredLocale === 'en' ? 'en' : undefined;

    if (!preferredLocale) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { brandingSettings: true },
    });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const current = parseBrandingSettings(user.brandingSettings);
    const next = { ...current, preferredLocale };

    await prisma.user.update({
      where: { id: userId },
      data: { brandingSettings: next },
    });

    return NextResponse.json({ preferredLocale });
  } catch (error) {
    console.error('[account preferences PATCH]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
