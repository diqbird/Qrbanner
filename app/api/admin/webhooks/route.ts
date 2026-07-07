export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const endpoints = await prisma.webhookEndpoint.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      url: true,
      label: true,
      enabled: true,
      createdAt: true,
      user: { select: { email: true } },
      _count: { select: { deliveries: true } },
    },
  });

  return NextResponse.json({
    endpoints: endpoints.map((e) => ({
      id: e.id,
      url: e.url,
      label: e.label,
      enabled: e.enabled,
      createdAt: e.createdAt,
      ownerEmail: e.user.email,
      deliveryCount: e._count.deliveries,
    })),
    total: endpoints.length,
  });
}
