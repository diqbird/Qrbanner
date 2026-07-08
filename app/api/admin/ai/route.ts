export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { isLandingLlmConfigured } from '@/lib/landing-llm';

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const [landingPagesEnabled, aiCampaignBatches, styleTemplates] = await Promise.all([
    prisma.qRCode.count({ where: { landingPageEnabled: true } }),
    prisma.qRCode
      .groupBy({ by: ['batchId'], where: { batchId: { not: null } } })
      .then((groups) => groups.length),
    prisma.qRStyleTemplate.count(),
  ]);

  return NextResponse.json({
    llmConfigured: isLandingLlmConfigured(),
    model: process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini',
    features: {
      landingCopy: true,
      campaignPlanner: true,
      styleSuggestions: true,
    },
    usage: {
      landingPagesEnabled,
      aiCampaignBatches,
      styleTemplates,
    },
  });
}
