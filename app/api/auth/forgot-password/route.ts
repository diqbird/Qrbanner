export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendPasswordResetEmail, sendPasswordResetOAuthEmail } from '@/lib/email';
import { createPasswordResetCode } from '@/lib/password-reset';
import { resolveOutboundEmailLocaleFromRequest } from '@/lib/i18n/resolve-outbound-email-locale';
import { formatOAuthProviderLabels } from '@/lib/oauth-provider-labels';
import { clientIp } from '@/lib/rate-limit';
import { enforceRateLimit } from '@/lib/authenticated-rate-limit';
import { AUTH_FORGOT_PASSWORD } from '@/lib/rate-limit-policies';
import { guardPublicPost } from '@/lib/guard-public-post';

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const limited = await enforceRateLimit(
      AUTH_FORGOT_PASSWORD.key(ip),
      AUTH_FORGOT_PASSWORD.limit,
      AUTH_FORGOT_PASSWORD.windowMs
    );
    if (limited) return limited;

    let body: { email?: string; turnstileToken?: string; captchaToken?: string; locale?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
    }

    const blocked = await guardPublicPost(req, body, ip);
    if (blocked) return blocked;

    const { email, locale: bodyLocale } = body;
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email_required' }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalized },
      include: { accounts: { select: { provider: true } } },
    });

    if (!user) {
      return NextResponse.json({ message: 'reset_email_sent' });
    }

    const locale = resolveOutboundEmailLocaleFromRequest(req, user.brandingSettings, bodyLocale);

    if (!user.password && user.accounts.length > 0) {
      const providers = formatOAuthProviderLabels(
        user.accounts.map((account) => account.provider),
        locale
      );
      const result = await sendPasswordResetOAuthEmail(user.email, providers, user.name, locale);
      if (!result.sent && result.fallback) {
        console.log(`[forgot-password] OAuth notice fallback for ${user.email}`);
      }
      return NextResponse.json({ message: 'reset_email_sent' });
    }

    const { code, codeHash, expiry } = createPasswordResetCode(user.email);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: codeHash, passwordResetExpiry: expiry },
    });

    const result = await sendPasswordResetEmail(user.email, code, user.name, locale);
    if (!result.sent && result.fallback) {
      console.log(`[forgot-password] SMTP fallback — code for ${user.email}: ${code}`);
    }

    return NextResponse.json({ message: 'reset_email_sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
