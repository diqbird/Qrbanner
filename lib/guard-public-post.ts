import { NextRequest, NextResponse } from 'next/server';
import { assertBrowserOrigin } from '@/lib/csrf-origin';
import { isTurnstileConfigured, verifyTurnstileToken } from '@/lib/turnstile';

export async function guardPublicPost(
  req: NextRequest,
  body: Record<string, unknown>,
  ip: string
): Promise<NextResponse | null> {
  const originCheck = assertBrowserOrigin(req);
  if (!originCheck.ok) {
    return NextResponse.json({ error: originCheck.error }, { status: 403 });
  }

  if (isTurnstileConfigured()) {
    const token = body.turnstileToken ?? body.captchaToken;
    const ok = await verifyTurnstileToken(
      typeof token === 'string' ? token : undefined,
      ip
    );
    if (!ok) {
      return NextResponse.json({ error: 'captcha_failed' }, { status: 400 });
    }
  }

  return null;
}
