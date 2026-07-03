import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { authenticateApiRequest, isAuthError, type ApiAuthContext } from '@/lib/api-auth';

export type MobileAuthContext = {
  userId: string;
  email: string;
  via: 'session' | 'api_key';
  rateLimitHeaders?: Record<string, string>;
};

export async function authenticateMobileRequest(
  req: NextRequest
): Promise<MobileAuthContext | NextResponse> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  const email = session?.user?.email;

  if (userId && email) {
    return { userId, email, via: 'session' };
  }

  const api = await authenticateApiRequest(req);
  if (isAuthError(api)) return api;

  return {
    userId: api.userId,
    email: api.email,
    via: 'api_key',
    rateLimitHeaders: api.rateLimitHeaders,
  };
}

export function isMobileAuthError(
  result: MobileAuthContext | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
