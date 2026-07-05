export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { validatePassword } from '@/lib/password';
import { enforceRateLimit } from '@/lib/authenticated-rate-limit';
import { AUTH_CHANGE_PASSWORD } from '@/lib/rate-limit-policies';
import { requireUserId, isAuthError, requireSessionContext } from '@/lib/session-auth';

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

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
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
