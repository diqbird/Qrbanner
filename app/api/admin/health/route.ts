export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const started = Date.now();
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const [userCount, qrCount, scanCount, auditCount] = await Promise.all([
    prisma.user.count(),
    prisma.qRCode.count(),
    prisma.qRScan.count(),
    prisma.adminAuditLog.count(),
  ]);

  return NextResponse.json({
    status: dbOk ? 'healthy' : 'degraded',
    database: dbOk ? 'connected' : 'error',
    responseMs: Date.now() - started,
    nodeEnv: process.env.NODE_ENV ?? 'unknown',
    version: process.env.npm_package_version ?? '1.0.0',
    counts: { users: userCount, qrCodes: qrCount, scans: scanCount, auditLogs: auditCount },
    redis: process.env.REDIS_URL ? 'configured' : 'not_configured',
    smtp: process.env.SMTP_HOST ? 'configured' : 'not_configured',
  });
}
