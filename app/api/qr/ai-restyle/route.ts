export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { checkRateLimit } from '@/lib/rate-limit-store';
import {
  generateQrStyleWithLlm,
  isQrStyleLlmConfigured,
  type QrStyleLlmLocale,
} from '@/lib/qr-style-llm';

const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const rate = await checkRateLimit(`qr-style-llm:${userId}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const locale: QrStyleLlmLocale = body.locale === 'tr' ? 'tr' : 'en';
  const category = String(body.category ?? 'url').trim() || 'url';
  const qrName = body.qrName ? String(body.qrName).trim().slice(0, 80) : undefined;
  const businessContext = body.businessContext
    ? String(body.businessContext).trim().slice(0, 500)
    : undefined;

  const result = await generateQrStyleWithLlm({
    category,
    qrName,
    locale,
    businessContext,
    currentStyle: body.currentStyle,
  });

  return NextResponse.json({
    style: result.style,
    source: result.source,
    llmConfigured: isQrStyleLlmConfigured(),
  });
}
