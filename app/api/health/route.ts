export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isSmtpConfigured } from '@/lib/smtp-transport';
import { isBillingConfigured } from '@/lib/billing-provider';

export async function GET() {
  const started = Date.now();
  let dbOk = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const ok = dbOk;
  return NextResponse.json(
    {
      ok,
      status: ok ? 'operational' : 'degraded',
      checks: {
        database: dbOk,
        smtp: isSmtpConfigured(),
        billing: isBillingConfigured(),
      },
      responseMs: Date.now() - started,
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 }
  );
}
