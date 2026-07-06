import { createSmtpTransport, isSmtpConfigured, smtpFromAddress } from '@/lib/smtp-transport';
import { sendTenantMail } from '@/lib/tenant-email';
import { SUPPORT_EMAIL } from '@/lib/site-contact';
import {
  EmailNotConfiguredError,
  isDevEmailFallbackAllowed,
  logDevEmailSkipped,
} from '@/lib/email-fallback';

/**
 * SMTP email sending for QRbanner.
 *
 * Two mailboxes:
 *   noreply@ — SMTP_USER / SMTP_FROM (transactional sends)
 *   support@ — Reply-To on outbound mail; human inbox
 *
 * Configure on VPS (Hostinger):
 *   SMTP_HOST      smtp.hostinger.com
 *   SMTP_PORT      465 (SSL) or 587 (TLS)
 *   SMTP_USER      noreply@qrbanner.com
 *   SMTP_PASSWORD  mailbox password
 *   SMTP_FROM      noreply@qrbanner.com (optional, defaults to SMTP_USER)
 *   SMTP_SECURE    true on port 465
 */

function getTransporter() {
  return createSmtpTransport();
}

async function deliverMail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const transporter = getTransporter();
  const from = smtpFromAddress();
  if (!transporter) {
    return { sent: false as const, fallback: true as const };
  }
  await transporter.sendMail({
    from: `QRbanner <${from}>`,
    replyTo: SUPPORT_EMAIL,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
  return { sent: true as const, fallback: false as const };
}

export function isEmailConfigured(): boolean {
  return isSmtpConfigured();
}

export async function sendVerificationEmail(to: string, code: string, name?: string | null) {
  const transporter = getTransporter();
  const from = smtpFromAddress();
  const greeting = name ? `Hi ${name},` : 'Hi,';

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0f172a">
    <div style="text-align:center;margin-bottom:24px">
      <div style="display:inline-block;width:48px;height:48px;line-height:48px;background:#4f46e5;color:#fff;border-radius:12px;font-size:24px">▣</div>
      <h1 style="font-size:20px;margin:12px 0 0">QRbanner</h1>
    </div>
    <p style="font-size:15px">${greeting}</p>
    <p style="font-size:15px">Use the verification code below to confirm your email address and activate your QRbanner account:</p>
    <div style="text-align:center;margin:28px 0">
      <span style="display:inline-block;font-size:34px;letter-spacing:10px;font-weight:700;background:#f1f5f9;padding:16px 24px;border-radius:12px;color:#0f172a">${code}</span>
    </div>
    <p style="font-size:13px;color:#64748b">This code expires in 30 minutes. If you didn't create a QRbanner account, you can safely ignore this email.</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
    <p style="font-size:12px;color:#94a3b8;text-align:center">&copy; ${new Date().getFullYear()} QRbanner. All rights reserved.</p>
  </div>`;

  if (!transporter) {
    if (isDevEmailFallbackAllowed()) {
      logDevEmailSkipped('verification', to);
      return { sent: false, fallback: true };
    }
    throw new EmailNotConfiguredError('verification email');
  }

  await transporter.sendMail({
    from: `QRbanner <${from}>`,
    replyTo: SUPPORT_EMAIL,
    to,
    subject: 'Your QRbanner verification code',
    text: `Your QRbanner verification code is ${code}. It expires in 30 minutes.`,
    html,
  });

  return { sent: true, fallback: false };
}

function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    'https://qrbanner.com'
  ).replace(/\/$/, '');
}

export async function sendPasswordResetEmail(to: string, code: string, name?: string | null) {
  const transporter = getTransporter();
  const from = smtpFromAddress();
  const greeting = name ? `Hi ${name},` : 'Hi,';
  const resetUrl = `${siteBaseUrl()}/reset-password?email=${encodeURIComponent(to)}`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0f172a">
    <div style="text-align:center;margin-bottom:24px">
      <div style="display:inline-block;width:48px;height:48px;line-height:48px;background:#4f46e5;color:#fff;border-radius:12px;font-size:24px">▣</div>
      <h1 style="font-size:20px;margin:12px 0 0">QRbanner</h1>
    </div>
    <p style="font-size:15px">${greeting}</p>
    <p style="font-size:15px">We received a request to reset your password. Use the code below to choose a new password:</p>
    <div style="text-align:center;margin:28px 0">
      <div style="display:inline-block;background:#f1f5f9;color:#0f172a;padding:16px 28px;border-radius:12px;font-size:32px;font-weight:700;letter-spacing:10px">${code}</div>
    </div>
    <div style="text-align:center;margin:20px 0">
      <a href="${resetUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600">Enter code</a>
    </div>
    <p style="font-size:13px;color:#64748b">This code expires in 15 minutes. If you didn't request a reset, you can ignore this email.</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
    <p style="font-size:12px;color:#94a3b8;text-align:center">&copy; ${new Date().getFullYear()} QRbanner</p>
  </div>`;

  if (!transporter) {
    if (isDevEmailFallbackAllowed()) {
      logDevEmailSkipped('password reset', to);
      return { sent: false, fallback: true };
    }
    throw new EmailNotConfiguredError('password reset email');
  }

  try {
    const result = await deliverMail({
      to,
      subject: 'Your QRbanner password reset code',
      text: `Your password reset code is ${code}. It expires in 15 minutes. Enter it at ${resetUrl}`,
      html,
    });
    console.log(`[email] Password reset sent to ${to}`, result);
    return result;
  } catch (error) {
    console.error('[email] Password reset send failed:', error);
    throw error;
  }
}

/** Inform OAuth-only accounts that password reset does not apply. */
export async function sendPasswordResetOAuthEmail(
  to: string,
  providers: string[],
  name?: string | null
) {
  const greeting = name ? `Hi ${name},` : 'Hi,';
  const providerList = providers.length ? providers.join(', ') : 'your social sign-in provider';
  const loginUrl = `${siteBaseUrl()}/login`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0f172a">
    <div style="text-align:center;margin-bottom:24px">
      <div style="display:inline-block;width:48px;height:48px;line-height:48px;background:#4f46e5;color:#fff;border-radius:12px;font-size:24px">▣</div>
      <h1 style="font-size:20px;margin:12px 0 0">QRbanner</h1>
    </div>
    <p style="font-size:15px">${greeting}</p>
    <p style="font-size:15px">We received a password reset request for your account. This email address uses <strong>${providerList}</strong> sign-in, so there is no QRbanner password to reset.</p>
    <p style="font-size:15px">Please sign in with ${providerList} instead:</p>
    <div style="text-align:center;margin:28px 0">
      <a href="${loginUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600">Go to sign in</a>
    </div>
    <p style="font-size:13px;color:#64748b">If you did not request this, you can ignore this email. Need help? Reply to ${SUPPORT_EMAIL}.</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
    <p style="font-size:12px;color:#94a3b8;text-align:center">&copy; ${new Date().getFullYear()} QRbanner</p>
  </div>`;

  if (!getTransporter()) {
    if (isDevEmailFallbackAllowed()) {
      logDevEmailSkipped('OAuth reset notice', to);
      return { sent: false, fallback: true };
    }
    throw new EmailNotConfiguredError('OAuth reset notice');
  }

  try {
    const result = await deliverMail({
      to,
      subject: 'QRbanner password reset — use social sign-in',
      text: `Your account uses ${providerList} sign-in. Sign in at ${loginUrl}. No password reset is needed.`,
      html,
    });
    console.log(`[email] OAuth reset notice sent to ${to}`, result);
    return result;
  } catch (error) {
    console.error('[email] OAuth reset notice failed:', error);
    throw error;
  }
}

export interface ScanNotificationPayload {
  userName?: string | null;
  qrName: string;
  shortCode: string;
  qrId: string;
  totalScans: number;
  reason: 'first' | 'milestone' | 'every';
  milestone?: number;
  analyticsUrl: string;
  country?: string;
  city?: string;
  device?: string;
  os?: string;
}

export async function sendScanNotificationEmail(
  to: string,
  payload: ScanNotificationPayload,
  workspaceId?: string | null,
  locale: import('@/lib/i18n/types').Locale = 'en',
) {
  const { buildScanNotificationEmailContent } = await import('@/lib/i18n/scan-notification-email');
  const { subject, html, text } = buildScanNotificationEmailContent(locale, payload);

  const result = await sendTenantMail({
    workspaceId,
    to,
    subject,
    text,
    html,
    fromName: 'QRbanner',
  });
  return { sent: result.sent, fallback: result.fallback };
}

export async function sendAutomationNotification(
  to: string,
  subject: string,
  text: string,
  workspaceId?: string | null
): Promise<{ sent: boolean; fallback?: boolean }> {
  const result = await sendTenantMail({
    workspaceId,
    to,
    subject,
    text,
    html: `<div style="font-family:Arial,sans-serif;white-space:pre-wrap">${text.replace(/</g, '&lt;')}</div>`,
    fromName: 'QRbanner',
  });
  return { sent: result.sent, fallback: result.fallback };
}
