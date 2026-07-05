export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { setPrimaryDomain } from '@/lib/custom-domain';
import { requireUserId, isAuthError } from '@/lib/session-auth';


export async function PATCH(
  req: NextRequest,
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

    const body = await req.json();
    if (body.is_primary === true || body.isPrimary === true) {
      if (domain.status !== 'verified') {
        return NextResponse.json({ error: 'Domain must be verified first' }, { status: 400 });
      }
      await setPrimaryDomain(userId, domain.id);
    }

    const updated = await prisma.customDomain.findUnique({ where: { id: params.id } });
    return NextResponse.json({ domain: updated });
  } catch (error) {
    console.error('Domain patch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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

    const wasPrimary = domain.isPrimary;
    await prisma.customDomain.delete({ where: { id: params.id } });

    if (wasPrimary) {
      const next = await prisma.customDomain.findFirst({
        where: { userId, status: 'verified' },
        orderBy: { createdAt: 'asc' },
      });
      if (next) {
        await prisma.customDomain.update({
          where: { id: next.id },
          data: { isPrimary: true },
        });
      }
    }

    return NextResponse.json({ message: 'Domain removed' });
  } catch (error) {
    console.error('Domain delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
