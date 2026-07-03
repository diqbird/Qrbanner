export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

/** Universal links for future native iOS app. Set APPLE_TEAM_ID + APPLE_BUNDLE_ID on VPS. */
export async function GET() {
  const teamId = process.env.APPLE_TEAM_ID ?? 'TEAMID';
  const bundleId = process.env.APPLE_BUNDLE_ID ?? 'com.qrbanner.app';

  const body = {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${teamId}.${bundleId}`,
          paths: ['/dashboard*', '/qr/*', '/s/*', '/login', '/settings*'],
        },
      ],
    },
    webcredentials: {
      apps: [`${teamId}.${bundleId}`],
    },
  };

  return NextResponse.json(body, {
    headers: { 'Content-Type': 'application/json' },
  });
}
