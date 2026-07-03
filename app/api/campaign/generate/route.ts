export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { checkRateLimit } from '@/lib/rate-limit-store';
import { generateCampaignPlan, isCampaignLlmConfigured } from '@/lib/campaign-ai';
import { MAX_CAMPAIGN_PROMPT_LEN } from '@/lib/campaign-types';

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const rate = await checkRateLimit(`campaign-ai:${userId}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const prompt = String(body.prompt ?? '').trim().slice(0, MAX_CAMPAIGN_PROMPT_LEN);
  if (prompt.length < 8) {
    return NextResponse.json({ error: 'prompt_too_short' }, { status: 400 });
  }

  const locale = body.locale === 'tr' ? 'tr' : 'en';
  const businessName = body.businessName ? String(body.businessName).trim().slice(0, 80) : undefined;
  const websiteUrl = body.websiteUrl ? String(body.websiteUrl).trim().slice(0, 300) : undefined;

  const plan = await generateCampaignPlan({
    prompt,
    locale,
    businessName,
    websiteUrl,
  });

  return NextResponse.json({
    plan,
    llmConfigured: isCampaignLlmConfigured(),
  });
}
