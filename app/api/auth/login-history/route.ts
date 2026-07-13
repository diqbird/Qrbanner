export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireSessionContext, isAuthError } from '@/lib/session-auth';
import { listUserLoginAuditLogs } from '@/lib/login-audit';

export async function GET(req: NextRequest) {
  const auth = await requireSessionContext();
  if (isAuthError(auth)) return auth;

  const email = auth.email?.trim();
  if (!email) {
    return NextResponse.json({ error: 'email_required' }, { status: 400 });
  }

  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '20', 10) || 20;
  const offset = parseInt(req.nextUrl.searchParams.get('offset') ?? '0', 10) || 0;

  const result = await listUserLoginAuditLogs({
    userId: auth.userId,
    email,
    limit,
    offset,
  });

  return NextResponse.json({
    entries: result.entries.map((row) => ({
      id: row.id,
      provider: row.provider,
      outcome: row.outcome,
      reason: row.reason,
      ip_address: row.ipAddress,
      user_agent: row.userAgent,
      created_at: row.createdAt.toISOString(),
    })),
    total: result.total,
    limit: result.limit,
    offset: result.offset,
  });
}
