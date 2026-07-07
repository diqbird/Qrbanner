export const dynamic = 'force-dynamic';

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { sendVerificationEmail, isEmailConfigured } from '@/lib/email';
import { EmailNotConfiguredError } from '@/lib/email-fallback';
import { resolveEmailLocaleFromRequest } from '@/lib/i18n/resolve-email-locale';
import { VERIFICATION_CODE_TTL_MS } from '@/lib/auth-code-policy';
import { validatePassword } from '@/lib/password';
import { clientIp } from '@/lib/rate-limit';
import { enforcePublicRateLimit } from '@/lib/public-rate-limit';
import { resolveReferrerByCode, recordReferralSignup } from '@/lib/referral';
import { assertPasswordLoginAllowed } from '@/lib/workspace-sso';
import { guardPublicPost } from '@/lib/guard-public-post';

export async function POST(req: NextRequest) {
  try {
    const limited = await enforcePublicRateLimit(req, 'signup', 5, 15 * 60 * 1000);
    if (limited) return limited;

    const ip = clientIp(req);
    const body = await req.json();
    const blocked = await guardPublicPost(req, body, ip);
    if (blocked) return blocked;

    const { email, password, name, referralCode, ref, locale: bodyLocale } = body;
    const locale = resolveEmailLocaleFromRequest(req, bodyLocale);

    if (!email || !password) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const ssoCheck = await assertPasswordLoginAllowed(email.toLowerCase());
    if (!ssoCheck.ok) {
      return NextResponse.json({ error: ssoCheck.code }, { status: 403 });
    }

    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) {
      return NextResponse.json({ error: pwCheck.code }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'email_exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const refCode = String(referralCode ?? ref ?? '').trim();
    const referredByUserId = refCode ? await resolveReferrerByCode(refCode) : null;

    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    const verificationExpiry = new Date(Date.now() + VERIFICATION_CODE_TTL_MS);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name ?? null,
        verificationCode,
        verificationExpiry,
        brandingSettings: { preferredLocale: locale },
      },
    });

    if (referredByUserId) {
      await recordReferralSignup(referredByUserId, user.id);
    }

    try {
      await sendVerificationEmail(user.email, verificationCode, user.name, locale);
    } catch (err) {
      if (err instanceof EmailNotConfiguredError) {
        return NextResponse.json({ error: 'email_not_configured' }, { status: 503 });
      }
      throw err;
    }

    return NextResponse.json({
      message: 'signup_success',
      requiresVerification: true,
      emailConfigured: isEmailConfigured(),
    });
  } catch (error: unknown) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
