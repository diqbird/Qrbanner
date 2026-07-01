export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { decryptTotpSecret, verifyTotpCode } from '@/lib/totp';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const code = String(body.code ?? '').trim();
  const password = typeof body.password === 'string' ? body.password : '';
  if (!code) return NextResponse.json({ error: 'mfa_code_required' }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totpEnabled: true, totpSecret: true, password: true },
  });
  if (!user) return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
  if (!user.totpEnabled) return NextResponse.json({ error: 'mfa_not_enabled' }, { status: 400 });

  if (user.password) {
    if (!password) return NextResponse.json({ error: 'password_required' }, { status: 400 });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: 'wrong_current_password' }, { status: 400 });
  }

  const secret = decryptTotpSecret(user.totpSecret);
  if (!secret || !verifyTotpCode(secret, code)) {
    return NextResponse.json({ error: 'invalid_mfa_code' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      totpEnabled: false,
      totpSecret: null,
      totpPendingSecret: null,
    },
  });

  return NextResponse.json({ ok: true });
}
