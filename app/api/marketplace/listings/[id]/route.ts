export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sanitizeListingInput } from '@/lib/marketplace-sanitize';
import { requireUserId, isAuthError } from '@/lib/session-auth';

const select = {
  id: true,
  title: true,
  description: true,
  priceCents: true,
  currency: true,
  templateId: true,
  category: true,
  previewUrl: true,
  status: true,
  createdAt: true,
  seller: { select: { displayName: true, userId: true } },
} as const;

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: params.id },
    select,
  });
  if (!listing || listing.status !== 'published') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ listing });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const existing = await prisma.marketplaceListing.findFirst({
    where: { id: params.id, seller: { userId } },
    include: { seller: true },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const input = sanitizeListingInput({
    title: body.title ?? existing.title,
    description: body.description ?? existing.description,
    priceCents: body.priceCents ?? existing.priceCents,
    templateId: body.templateId !== undefined ? body.templateId : existing.templateId,
    category: body.category !== undefined ? body.category : existing.category,
    previewUrl: body.previewUrl !== undefined ? body.previewUrl : existing.previewUrl,
    status: body.status ?? existing.status,
  });
  if (!input) return NextResponse.json({ error: 'Invalid listing' }, { status: 400 });

  if (input.priceCents > 0 && !existing.seller.connectOnboardingDone) {
    return NextResponse.json(
      { error: 'Complete Stripe Connect onboarding before selling paid templates.' },
      { status: 403 }
    );
  }

  const listing = await prisma.marketplaceListing.update({
    where: { id: params.id },
    data: {
      title: input.title,
      description: input.description,
      priceCents: input.priceCents,
      templateId: input.templateId,
      category: input.category,
      previewUrl: input.previewUrl,
      status: input.status ?? existing.status,
    },
    select,
  });

  return NextResponse.json({ listing });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const existing = await prisma.marketplaceListing.findFirst({
    where: { id: params.id, seller: { userId } },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.marketplaceListing.update({
    where: { id: params.id },
    data: { status: 'archived' },
  });

  return NextResponse.json({ ok: true });
}
