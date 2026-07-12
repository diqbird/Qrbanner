export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit-store';
import { generateCampaignPlan, isCampaignLlmConfigured } from '@/lib/campaign-ai';
import { MAX_CAMPAIGN_PROMPT_LEN } from '@/lib/campaign-types';
import { parseAiLocale } from '@/lib/i18n/ai-locale';
import { requireUserId, isAuthError, getSessionUserId } from '@/lib/session-auth';

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const rate = await checkRateLimit(`campaign-ai:${userId}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const contentType = req.headers.get('content-type') ?? '';
  if (contentType && !contentType.includes('application/json')) {
    return NextResponse.json({ error: 'unsupported_content_type' }, { status: 415 });
  }

  const raw = await req.text();
  if (!raw.trim()) {
    return NextResponse.json({ error: 'empty_body' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const promptRaw = String(body.prompt ?? '').trim();
  if (promptRaw.length > MAX_CAMPAIGN_PROMPT_LEN) {
    return NextResponse.json({ error: 'prompt_too_long' }, { status: 400 });
  }
  const prompt = promptRaw;
  if (prompt.length < 8) {
    return NextResponse.json({ error: 'prompt_too_short' }, { status: 400 });
  }

  const locale = parseAiLocale(body.locale);
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
