export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  buildDetailedHealthResponse,
  buildPublicHealthResponse,
  healthDetailAuthorized,
} from '@/lib/health-response';

export async function GET(req: Request) {
  const started = Date.now();
  let dbOk = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const detailed = healthDetailAuthorized(req);
  const body = detailed
    ? buildDetailedHealthResponse({ dbOk, started })
    : buildPublicHealthResponse({ dbOk, started });

  return NextResponse.json(body, { status: body.ok ? 200 : 503 });
}
