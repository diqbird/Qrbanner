export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import {
  assignQrsToCampaign,
  createCampaign,
  deleteCampaign,
  listCampaignsForWorkspace,
  renameCampaign,
  assertCampaignInWorkspace,
} from '@/lib/campaigns';
import { getActiveWorkspaceId, assertWorkspaceRole } from '@/lib/workspace';
import { QR_MUTATION_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspaceId = await getActiveWorkspaceId(userId);
    const access = await assertWorkspaceRole(userId, workspaceId, 'viewer');
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

    const campaigns = await listCampaignsForWorkspace(workspaceId);
    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('[campaigns GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const limited = await rateLimitRequest(req, 'campaign-mutation', QR_MUTATION_LIMIT.limit, QR_MUTATION_LIMIT.windowMs, userId);
    if (limited) return limited;

    const workspaceId = await getActiveWorkspaceId(userId);
    const access = await assertWorkspaceRole(userId, workspaceId, 'editor');
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

    const body = await req.json();
    const name = String(body?.name ?? '').trim();
    if (!name) return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 });

    const campaign = await createCampaign(workspaceId, name);
    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error('[campaigns POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
