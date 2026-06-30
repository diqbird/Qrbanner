import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashApiKey, isValidApiKeyFormat } from '@/lib/api-key';

export interface ApiAuthContext {
  userId: string;
  email: string;
}

function extractApiKey(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (auth?.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  const headerKey = req.headers.get('x-api-key');
  if (headerKey?.trim()) return headerKey.trim();
  return null;
}

export async function authenticateApiRequest(
  req: NextRequest
): Promise<ApiAuthContext | NextResponse> {
  const rawKey = extractApiKey(req);
  if (!rawKey) {
    return NextResponse.json(
      { error: 'Missing API key. Use Authorization: Bearer <key> or X-API-Key header.' },
      { status: 401 }
    );
  }

  if (!isValidApiKeyFormat(rawKey)) {
    return NextResponse.json({ error: 'Invalid API key format' }, { status: 401 });
  }

  const keyHash = hashApiKey(rawKey);
  const user = await prisma.user.findFirst({
    where: { apiKeyHash: keyHash },
    select: { id: true, email: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  return { userId: user.id, email: user.email };
}

export function isAuthError(result: ApiAuthContext | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess<T extends Record<string, unknown>>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
