export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { validatePassword } from '@/lib/password';
import { enforceRateLimit } from '@/lib/authenticated-rate-limit';
import { AUTH_CHANGE_PASSWORD } from '@/lib/rate-limit-policies';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import { verifyTotpOrRecovery } from '@/lib/mfa-recovery';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const limited = await enforceRateLimit(
      AUTH_CHANGE_PASSWORD.key(userId),
      AUTH_CHANGE_PASSWORD.limit,
      AUTH_CHANGE_PASSWORD.windowMs
    );
    if (limited) return limited;

    const body = await req.json().catch(() => ({}));
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
    const mfaCode =
      typeof body.mfaCode === 'string'
        ? body.mfaCode
        : typeof body.mfa_code === 'string'
          ? body.mfa_code
          : typeof body.code === 'string'
            ? body.code
            : '';

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        totpEnabled: true,
        totpSecret: true,
        totpRecoveryCodes: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json({ error: 'sso_account' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'wrong_current_password' }, { status: 400 });
    }

    if (user.totpEnabled) {
      if (!mfaCode.trim()) {
        return NextResponse.json({ error: 'mfa_code_required' }, { status: 400 });
      }
      const verified = await verifyTotpOrRecovery({
        userId: user.id,
        code: mfaCode,
        totpSecretEncrypted: user.totpSecret,
        recoveryCodes: user.totpRecoveryCodes,
      });
      if (!verified) {
        return NextResponse.json({ error: 'invalid_mfa_code' }, { status: 400 });
      }
    }

    const pwCheck = validatePassword(newPassword);
    if (!pwCheck.ok) {
      return NextResponse.json({ error: pwCheck.code }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, sessionVersion: { increment: 1 } },
    });

    return NextResponse.json({ message: 'password_changed' });
  } catch (error: unknown) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
