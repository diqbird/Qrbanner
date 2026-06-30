export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import {
  assignQrsToCampaign,
  deleteCampaign,
  listCampaignsForUser,
  renameCampaign,
} from '@/lib/campaigns';
import { prisma } from '@/lib/db';
import { QR_MUTATION_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const campaignId = params.id;
    const campaigns = await listCampaignsForUser(userId);
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

    const qrCodes = await prisma.qRCode.findMany({
      where: { userId, batchId: campaignId, isArchived: false },
      select: {
        id: true,
        name: true,
        shortCode: true,
        category: true,
        totalScans: true,
        isActive: true,
      },
      orderBy: { totalScans: 'desc' },
    });

    return NextResponse.json({ campaign, qrCodes });
  } catch (error) {
    console.error('[campaigns GET id]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const limited = await rateLimitRequest(req, 'campaign-mutation', QR_MUTATION_LIMIT.limit, QR_MUTATION_LIMIT.windowMs, userId);
    if (limited) return limited;

    const body = await req.json();
    const campaignId = params.id;

    if (body?.name) {
      await renameCampaign(userId, campaignId, String(body.name));
    }

    if (Array.isArray(body?.qrIds) && body.qrIds.length > 0) {
      const name =
        String(body?.name ?? '').trim() ||
        (await listCampaignsForUser(userId)).find((c) => c.id === campaignId)?.name ||
        'Campaign';
      await assignQrsToCampaign(userId, campaignId, name, body.qrIds as string[]);
    }

    const campaigns = await listCampaignsForUser(userId);
    const campaign = campaigns.find((c) => c.id === campaignId);
    return NextResponse.json({ campaign });
  } catch (error) {
    console.error('[campaigns PATCH]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const limited = await rateLimitRequest(req, 'campaign-mutation', QR_MUTATION_LIMIT.limit, QR_MUTATION_LIMIT.windowMs, userId);
    if (limited) return limited;

    const count = await deleteCampaign(userId, params.id);
    return NextResponse.json({ ok: true, unassigned: count });
  } catch (error) {
    console.error('[campaigns DELETE]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
