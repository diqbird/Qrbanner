export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';
import { verifyTotpOrRecovery } from '@/lib/mfa-recovery';
import { createMfaProofToken } from '@/lib/mfa-step-up';
import { checkRateLimit, clientIp } from '@/lib/rate-limit-store';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function POST(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const ip = clientIp(req);
  const rl = await checkRateLimit(`mfa-verify:${userId}:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token?.mfaVerified !== false) {
    return NextResponse.json({ ok: true, mfaVerified: true });
  }

  const body = await req.json().catch(() => ({}));
  const code = String(body.code ?? '').trim();
  if (!code) return NextResponse.json({ error: 'mfa_code_required' }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totpEnabled: true, totpSecret: true, totpRecoveryCodes: true },
  });
  if (!user?.totpEnabled) return NextResponse.json({ error: 'mfa_not_enabled' }, { status: 400 });

  const verified = await verifyTotpOrRecovery({
    userId,
    code,
    totpSecretEncrypted: user.totpSecret,
    recoveryCodes: user.totpRecoveryCodes,
  });
  if (!verified) {
    return NextResponse.json({ error: 'invalid_mfa_code' }, { status: 400 });
  }

  const mfaProofToken = createMfaProofToken(userId);
  return NextResponse.json({ ok: true, mfaVerified: true, mfaProofToken });
}
