export const dynamic = 'force-dynamic';
export const revalidate = 300;

import { NextRequest, NextResponse } from 'next/server';
import { getPublicPlatformStats } from '@/lib/public-stats';
import { PUBLIC_STATS_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';

export async function GET(req: NextRequest) {
  const limited = await rateLimitRequest(
    req,
    'public-stats',
    PUBLIC_STATS_LIMIT.limit,
    PUBLIC_STATS_LIMIT.windowMs
  );
  if (limited) return limited;

  const stats = await getPublicPlatformStats();
  return NextResponse.json(stats, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
