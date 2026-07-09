export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  claimStudioEntitlement,
  claimStudioWithSession,
} from '@/lib/studio-entitlement';
import { enforcePublicRateLimit } from '@/lib/public-rate-limit';
import { getSessionUserId } from '@/lib/session-auth';

const bodySchema = z.object({
  action: z.enum(['register', 'login', 'claim']),
  email: z.string().email().optional(),
  password: z.string().optional(),
  name: z.string().max(120).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } },
) {
  const limited = await enforcePublicRateLimit(req, 'studio-claim', 10, 15 * 60 * 1000);
  if (limited) return limited;

  const token = params.token?.trim();
  if (!token) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const sessionUserId = await getSessionUserId();

  if (parsed.data.action === 'claim') {
    if (!sessionUserId) {
      return NextResponse.json({ error: 'auth_required' }, { status: 401 });
    }
    const result = await claimStudioWithSession(sessionUserId, token);
    if (!result.ok) {
      return NextResponse.json({ error: result.code }, { status: 403 });
    }
    return NextResponse.json({ ok: true, entitlement: result.entitlement });
  }

  if (!parsed.data.email) {
    return NextResponse.json({ error: 'missing_email' }, { status: 400 });
  }

  const result = await claimStudioEntitlement({
    token,
    action: parsed.data.action,
    email: parsed.data.email,
    password: parsed.data.password,
    name: parsed.data.name,
  });

  if (!result.ok) {
    const status =
      result.code === 'email_exists' || result.code === 'invalid_credentials'
        ? 401
        : 403;
    return NextResponse.json({ error: result.code }, { status });
  }

  return NextResponse.json({
    ok: true,
    entitlement: result.entitlement,
    email: result.email,
  });
}
