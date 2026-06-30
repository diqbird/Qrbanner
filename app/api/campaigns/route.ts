export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { createCampaign, listCampaignsForUser } from '@/lib/campaigns';
import { QR_MUTATION_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const campaigns = await listCampaignsForUser(userId);
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

    const body = await req.json();
    const name = String(body?.name ?? '').trim();
    if (!name) return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 });

    const campaign = await createCampaign(userId, name);
    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error('[campaigns POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
