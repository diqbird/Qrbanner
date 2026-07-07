import { translate, type Locale } from '@/lib/i18n';
import { authEmailDurationVars } from '@/lib/i18n/policy-day-vars';
import { SUPPORT_EMAIL } from '@/lib/site-contact';

function t(locale: Locale, key: string, vars?: Record<string, string | number>) {
  const durationVars = authEmailDurationVars(locale);
  return translate(locale, key, { ...durationVars, ...vars });
}

function emailShell(locale: Locale, body: string): string {
  const rights = t(locale, 'authEmail.footerRights', { year: new Date().getFullYear() });
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0f172a">
    <div style="text-align:center;margin-bottom:24px">
      <div style="display:inline-block;width:48px;height:48px;line-height:48px;background:#4f46e5;color:#fff;border-radius:12px;font-size:24px">▣</div>
      <h1 style="font-size:20px;margin:12px 0 0">QRbanner</h1>
    </div>
    ${body}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
    <p style="font-size:12px;color:#94a3b8;text-align:center">${rights}</p>
  </div>`;
}

export function buildVerificationEmailContent(
  locale: Locale,
  code: string,
  name?: string | null,
): { subject: string; html: string; text: string } {
  const greeting = name
    ? t(locale, 'authEmail.verification.greeting', { name })
    : t(locale, 'authEmail.verification.greetingNoName');

  const subject = t(locale, 'authEmail.verification.subject');
  const intro = t(locale, 'authEmail.verification.intro');
  const expiryNote = t(locale, 'authEmail.verification.expiryNote');
  const text = t(locale, 'authEmail.verification.text', { code });

  const html = emailShell(
    locale,
    `
    <p style="font-size:15px">${greeting}</p>
    <p style="font-size:15px">${intro}</p>
    <div style="text-align:center;margin:28px 0">
      <span style="display:inline-block;font-size:34px;letter-spacing:10px;font-weight:700;background:#f1f5f9;padding:16px 24px;border-radius:12px;color:#0f172a">${code}</span>
    </div>
    <p style="font-size:13px;color:#64748b">${expiryNote}</p>`,
  );

  return { subject, html, text };
}

export function buildPasswordResetEmailContent(
  locale: Locale,
  code: string,
  resetUrl: string,
  name?: string | null,
): { subject: string; html: string; text: string } {
  const greeting = name
    ? t(locale, 'authEmail.passwordReset.greeting', { name })
    : t(locale, 'authEmail.passwordReset.greetingNoName');

  const subject = t(locale, 'authEmail.passwordReset.subject');
  const intro = t(locale, 'authEmail.passwordReset.intro');
  const enterCode = t(locale, 'authEmail.passwordReset.enterCode');
  const expiryNote = t(locale, 'authEmail.passwordReset.expiryNote');
  const text = t(locale, 'authEmail.passwordReset.text', { code, resetUrl });

  const html = emailShell(
    locale,
    `
    <p style="font-size:15px">${greeting}</p>
    <p style="font-size:15px">${intro}</p>
    <div style="text-align:center;margin:28px 0">
      <div style="display:inline-block;background:#f1f5f9;color:#0f172a;padding:16px 28px;border-radius:12px;font-size:32px;font-weight:700;letter-spacing:10px">${code}</div>
    </div>
    <div style="text-align:center;margin:20px 0">
      <a href="${resetUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600">${enterCode}</a>
    </div>
    <p style="font-size:13px;color:#64748b">${expiryNote}</p>`,
  );

  return { subject, html, text };
}

export function buildPasswordResetOAuthEmailContent(
  locale: Locale,
  providers: string[],
  loginUrl: string,
  name?: string | null,
): { subject: string; html: string; text: string } {
  const providerList = providers.length
    ? providers.join(', ')
    : t(locale, 'authEmail.passwordResetOAuth.defaultProvider');

  const greeting = name
    ? t(locale, 'authEmail.passwordResetOAuth.greeting', { name })
    : t(locale, 'authEmail.passwordResetOAuth.greetingNoName');

  const subject = t(locale, 'authEmail.passwordResetOAuth.subject');
  const introPlain = t(locale, 'authEmail.passwordResetOAuth.intro', { providers: providerList });
  const introHtml = introPlain.includes(providerList)
    ? introPlain.replace(providerList, `<strong>${providerList}</strong>`)
    : introPlain;
  const signInPrompt = t(locale, 'authEmail.passwordResetOAuth.signInPrompt', { providers: providerList });
  const goToSignIn = t(locale, 'authEmail.passwordResetOAuth.goToSignIn');
  const footerHelp = t(locale, 'authEmail.passwordResetOAuth.footerHelp', { supportEmail: SUPPORT_EMAIL });
  const text = t(locale, 'authEmail.passwordResetOAuth.text', { providers: providerList, loginUrl });

  const html = emailShell(
    locale,
    `
    <p style="font-size:15px">${greeting}</p>
    <p style="font-size:15px">${introHtml}</p>
    <p style="font-size:15px">${signInPrompt}</p>
    <div style="text-align:center;margin:28px 0">
      <a href="${loginUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600">${goToSignIn}</a>
    </div>
    <p style="font-size:13px;color:#64748b">${footerHelp}</p>`,
  );

  return { subject, html, text };
}
