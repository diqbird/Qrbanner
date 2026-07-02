export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { lookupSsoLoginPolicy } from '@/lib/workspace-sso';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')?.trim() ?? '';
  if (!email) {
    return NextResponse.json({ error: 'email_required' }, { status: 400 });
  }

  const policy = await lookupSsoLoginPolicy(email);
  return NextResponse.json(policy);
}
