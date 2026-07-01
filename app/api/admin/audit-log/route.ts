export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUserId } from '@/lib/admin-auth';
import { listAdminAuditLogs } from '@/lib/admin-audit';

export async function GET(req: NextRequest) {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '50', 10) || 50;
  const offset = parseInt(req.nextUrl.searchParams.get('offset') ?? '0', 10) || 0;

  const result = await listAdminAuditLogs({ limit, offset });
  return NextResponse.json(result);
}
