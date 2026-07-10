export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { listLoginAuditLogs } from '@/lib/login-audit';

export async function GET(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '50', 10) || 50;
  const offset = parseInt(req.nextUrl.searchParams.get('offset') ?? '0', 10) || 0;
  const outcome = req.nextUrl.searchParams.get('outcome')?.trim() || undefined;

  const result = await listLoginAuditLogs({ limit, offset, outcome });
  return NextResponse.json(result);
}
