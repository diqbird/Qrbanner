export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/site-settings-server';

export async function GET() {
  const settings = getSiteSettings();
  return NextResponse.json(settings, {
    headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=60' },
  });
}
