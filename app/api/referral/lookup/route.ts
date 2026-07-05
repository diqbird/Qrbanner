export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resolveReferrerByCode, parseBrandingSettings } from '@/lib/referral';
import { checkRateLimit } from '@/lib/rate-limit';

/** Public lookup — validates ?ref= code for signup banner (no email exposed). */
export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const limited = await checkRateLimit(`referral-lookup:${ip}`, 30, 15 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json({ valid: false, error: 'rate_limited' }, { status: 429 });
    }

    const code = req.nextUrl.searchParams.get('code')?.trim();
    if (!code) {
      return NextResponse.json({ valid: false });
    }

    const referrerId = await resolveReferrerByCode(code);
    if (!referrerId) {
      return NextResponse.json({ valid: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: referrerId },
      select: { name: true, brandingSettings: true },
    });

    const branding = parseBrandingSettings(user?.brandingSettings);
    const firstName = user?.name?.trim().split(/\s+/)[0];
    const displayName = branding.agencyName?.trim() || firstName || null;

    return NextResponse.json({
      valid: true,
      displayName,
      code: code.toUpperCase(),
    });
  } catch (error) {
    console.error('[referral lookup]', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
