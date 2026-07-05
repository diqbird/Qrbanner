export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { listAdminAuditLogs } from '@/lib/admin-audit';

export async function GET(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '50', 10) || 50;
  const offset = parseInt(req.nextUrl.searchParams.get('offset') ?? '0', 10) || 0;
  const action = req.nextUrl.searchParams.get('action')?.trim() || undefined;

  const result = await listAdminAuditLogs({ limit, offset, action });
  return NextResponse.json(result);
}
