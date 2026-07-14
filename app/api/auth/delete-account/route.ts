export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { enforceRateLimit } from '@/lib/authenticated-rate-limit';
import { AUTH_DELETE_ACCOUNT } from '@/lib/rate-limit-policies';
import { requireSessionContext, isAuthError } from '@/lib/session-auth';
import { requireMfaStepUp } from '@/lib/mfa-recovery';
import { assertCanDeleteAccount, deleteUserAccount } from '@/lib/delete-account';

const CONFIRM_PHRASE = 'DELETE';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireSessionContext();
    if (isAuthError(auth)) return auth;
    const { userId, email } = auth;
    if (!email?.trim()) {
      return NextResponse.json({ error: 'email_required' }, { status: 400 });
    }

    const limited = await enforceRateLimit(
      AUTH_DELETE_ACCOUNT.key(userId),
      AUTH_DELETE_ACCOUNT.limit,
      AUTH_DELETE_ACCOUNT.windowMs
    );
    if (limited) return limited;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const confirmation = typeof body.confirmation === 'string' ? body.confirmation.trim() : '';
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
    const mfaCode =
      typeof body.mfaCode === 'string'
        ? body.mfaCode
        : typeof body.mfa_code === 'string'
          ? body.mfa_code
          : typeof body.code === 'string'
            ? body.code
            : '';

    if (confirmation !== CONFIRM_PHRASE) {
      return NextResponse.json({ error: 'delete_confirmation_required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        password: true,
        totpEnabled: true,
        role: true,
      },
    });
    if (!user) return NextResponse.json({ error: 'user_not_found' }, { status: 404 });

    if (user.role === 'admin' || user.role === 'superadmin') {
      return NextResponse.json({ error: 'admin_account_cannot_delete' }, { status: 400 });
    }

    if (user.password) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'password_required' }, { status: 400 });
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json({ error: 'wrong_current_password' }, { status: 400 });
      }
    }

    const mfa = await requireMfaStepUp(userId, mfaCode);
    if (!mfa.ok) return NextResponse.json({ error: mfa.error }, { status: mfa.status });

    const canDelete = await assertCanDeleteAccount(userId);
    if (!canDelete.ok) {
      return NextResponse.json(
        {
          error: canDelete.error,
          workspaces: canDelete.workspaces,
        },
        { status: 409 }
      );
    }

    await deleteUserAccount(userId, user.email);

    return NextResponse.json({ ok: true, message: 'account_deleted' });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
