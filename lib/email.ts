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

export async function sendVerificationEmail(
  to: string,
  code: string,
  name?: string | null,
  locale: import('@/lib/i18n/types').Locale = 'en',
) {
  const transporter = getTransporter();
  const from = smtpFromAddress();
  const { buildVerificationEmailContent } = await import('@/lib/i18n/auth-transactional-email');
  const { subject, html, text } = buildVerificationEmailContent(locale, code, name);

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
    subject,
    text,
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

export async function sendPasswordResetEmail(
  to: string,
  code: string,
  name?: string | null,
  locale: import('@/lib/i18n/types').Locale = 'en',
) {
  const resetUrl = `${siteBaseUrl()}/reset-password?email=${encodeURIComponent(to)}`;
  const { buildPasswordResetEmailContent } = await import('@/lib/i18n/auth-transactional-email');
  const { subject, html, text } = buildPasswordResetEmailContent(locale, code, resetUrl, name);

  if (!getTransporter()) {
    if (isDevEmailFallbackAllowed()) {
      logDevEmailSkipped('password reset', to);
      return { sent: false, fallback: true };
    }
    throw new EmailNotConfiguredError('password reset email');
  }

  try {
    const result = await deliverMail({ to, subject, text, html });
    console.log(`[email] Password reset sent to ${to}`, result);
    return result;
  } catch (error) {
    console.error('[email] Password reset send failed:', error);
    throw error;
  }
}

export async function sendPasswordResetOAuthEmail(
  to: string,
  providers: string[],
  name?: string | null,
  locale: import('@/lib/i18n/types').Locale = 'en',
) {
  const loginUrl = `${siteBaseUrl()}/login`;
  const { buildPasswordResetOAuthEmailContent } = await import('@/lib/i18n/auth-transactional-email');
  const { subject, html, text } = buildPasswordResetOAuthEmailContent(locale, providers, loginUrl, name);

  if (!getTransporter()) {
    if (isDevEmailFallbackAllowed()) {
      logDevEmailSkipped('OAuth reset notice', to);
      return { sent: false, fallback: true };
    }
    throw new EmailNotConfiguredError('OAuth reset notice');
  }

  try {
    const result = await deliverMail({ to, subject, text, html });
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
