export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyDomainDns } from '@/lib/custom-domain';
import { requireUserId, isAuthError } from '@/lib/session-auth';


export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const domain = await prisma.customDomain.findFirst({
      where: { id: params.id, userId },
    });
    if (!domain) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });

    const result = await verifyDomainDns(domain.domain, domain.verifyToken);

    const updated = await prisma.customDomain.update({
      where: { id: domain.id },
      data: {
        status: result.ok ? 'verified' : 'pending',
        verifiedAt: result.ok ? new Date() : null,
        lastCheckedAt: new Date(),
      },
    });

    if (!result.ok) {
      return NextResponse.json({
        verified: false,
        domain: updated,
        error: result.reason ?? 'DNS verification failed',
      }, { status: 400 });
    }

    return NextResponse.json({ verified: true, domain: updated });
  } catch (error) {
    console.error('Domain verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
