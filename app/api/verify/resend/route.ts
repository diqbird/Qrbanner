export const dynamic = 'force-dynamic';

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import { EmailNotConfiguredError } from '@/lib/email-fallback';
import { resolveEmailLocaleFromRequest } from '@/lib/i18n/resolve-email-locale';
import { VERIFICATION_CODE_TTL_MS } from '@/lib/auth-code-policy';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';

const RESEND_LIMIT = 3;
const RESEND_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { email, locale: bodyLocale } = await req.json();
    const locale = resolveEmailLocaleFromRequest(req, bodyLocale);

    if (!email) {
      return NextResponse.json({ error: 'email_required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const ip = clientIp(req);
    const limited = await checkRateLimit(
      `verify-resend:${ip}:${normalizedEmail}`,
      RESEND_LIMIT,
      RESEND_WINDOW_MS
    );
    if (!limited.ok) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || user.emailVerified) {
      return NextResponse.json({ message: 'resend_maybe_sent' });
    }

    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    const verificationExpiry = new Date(Date.now() + VERIFICATION_CODE_TTL_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationCode, verificationExpiry },
    });

    try {
      await sendVerificationEmail(user.email, verificationCode, user.name, locale);
    } catch (err) {
      if (err instanceof EmailNotConfiguredError) {
        return NextResponse.json({ error: 'email_not_configured' }, { status: 503 });
      }
      throw err;
    }

    return NextResponse.json({ message: 'resend_success' });
  } catch (error: unknown) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
