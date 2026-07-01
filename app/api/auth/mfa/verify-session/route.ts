export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { decryptTotpSecret, verifyTotpCode } from '@/lib/totp';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token?.mfaVerified !== false) {
    return NextResponse.json({ ok: true, mfaVerified: true });
  }

  const body = await req.json().catch(() => ({}));
  const code = String(body.code ?? '').trim();
  if (!code) return NextResponse.json({ error: 'mfa_code_required' }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totpEnabled: true, totpSecret: true },
  });
  if (!user?.totpEnabled) return NextResponse.json({ error: 'mfa_not_enabled' }, { status: 400 });

  const secret = decryptTotpSecret(user.totpSecret);
  if (!secret || !verifyTotpCode(secret, code)) {
    return NextResponse.json({ error: 'invalid_mfa_code' }, { status: 400 });
  }

  return NextResponse.json({ ok: true, mfaVerified: true });
}
