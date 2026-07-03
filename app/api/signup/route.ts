export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { sendVerificationEmail, isEmailConfigured } from '@/lib/email';
import { validatePassword } from '@/lib/password';
import { checkRateLimit } from '@/lib/rate-limit';
import { resolveReferrerByCode, recordReferralSignup } from '@/lib/referral';
import { assertPasswordLoginAllowed } from '@/lib/workspace-sso';
import { guardPublicPost } from '@/lib/guard-public-post';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const limited = await checkRateLimit(`signup:${ip}`, 5, 15 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const body = await req.json();
    const blocked = await guardPublicPost(req, body, ip);
    if (blocked) return blocked;

    const { email, password, name, referralCode, ref } = body;

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

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpiry = new Date(Date.now() + 30 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name ?? null,
        verificationCode,
        verificationExpiry,
      },
    });

    if (referredByUserId) {
      await recordReferralSignup(referredByUserId, user.id);
    }

    await sendVerificationEmail(user.email, verificationCode, user.name);

    return NextResponse.json({
      message: 'signup_success',
      userId: user.id,
      requiresVerification: true,
      emailConfigured: isEmailConfigured(),
    });
  } catch (error: unknown) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
