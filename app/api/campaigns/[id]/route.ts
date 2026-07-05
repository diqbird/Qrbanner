export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import {
  assignQrsToCampaign,
  deleteCampaign,
  listCampaignsForWorkspace,
  renameCampaign,
  assertCampaignInWorkspace,
} from '@/lib/campaigns';
import { prisma } from '@/lib/db';
import { getActiveWorkspaceId, assertWorkspaceRole } from '@/lib/workspace';
import { QR_MUTATION_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const workspaceId = await getActiveWorkspaceId(userId);
    const access = await assertWorkspaceRole(userId, workspaceId, 'viewer');
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

    const campaignId = params.id;
    const campaigns = await listCampaignsForWorkspace(workspaceId);
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

    const qrCodes = await prisma.qRCode.findMany({
      where: { workspaceId, batchId: campaignId, isArchived: false },
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
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const limited = await rateLimitRequest(req, 'campaign-mutation', QR_MUTATION_LIMIT.limit, QR_MUTATION_LIMIT.windowMs, userId);
    if (limited) return limited;

    const workspaceId = await getActiveWorkspaceId(userId);
    const access = await assertWorkspaceRole(userId, workspaceId, 'editor');
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

    const body = await req.json();
    const campaignId = params.id;

    const exists = await assertCampaignInWorkspace(workspaceId, campaignId);
    if (!exists) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

    if (body?.name) {
      await renameCampaign(workspaceId, campaignId, String(body.name));
    }

    if (Array.isArray(body?.qrIds) && body.qrIds.length > 0) {
      const name =
        String(body?.name ?? '').trim() ||
        (await listCampaignsForWorkspace(workspaceId)).find((c) => c.id === campaignId)?.name ||
        'Campaign';
      await assignQrsToCampaign(workspaceId, campaignId, name, body.qrIds as string[]);
    }

    const campaigns = await listCampaignsForWorkspace(workspaceId);
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
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const limited = await rateLimitRequest(req, 'campaign-mutation', QR_MUTATION_LIMIT.limit, QR_MUTATION_LIMIT.windowMs, userId);
    if (limited) return limited;

    const workspaceId = await getActiveWorkspaceId(userId);
    const access = await assertWorkspaceRole(userId, workspaceId, 'editor');
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

    const count = await deleteCampaign(workspaceId, params.id);
    return NextResponse.json({ ok: true, unassigned: count });
  } catch (error) {
    console.error('[campaigns DELETE]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
