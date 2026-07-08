import { createSmtpTransport, isSmtpConfigured, smtpFromAddress } from '@/lib/smtp-transport';
import { sendTenantMail } from '@/lib/tenant-email';
import { SUPPORT_EMAIL } from '@/lib/site-contact';
import {
  EmailNotConfiguredError,
  isDevEmailFallbackAllowed,
  logDevEmailSkipped,
} from '@/lib/email-fallback';
import { recordEmailDelivery, type EmailDeliveryKind } from '@/lib/email-delivery-log';

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
  kind?: EmailDeliveryKind;
  actorId?: string | null;
}) {
  const transporter = getTransporter();
  const from = smtpFromAddress();
  const kind = options.kind ?? 'transactional';

  if (!transporter) {
    await recordEmailDelivery({
      kind,
      to: options.to,
      subject: options.subject,
      success: false,
      error: 'smtp_not_configured',
      actorId: options.actorId,
    });
    return { sent: false as const, fallback: true as const };
  }

  try {
    await transporter.sendMail({
      from: `QRbanner <${from}>`,
      replyTo: SUPPORT_EMAIL,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    await recordEmailDelivery({
      kind,
      to: options.to,
      subject: options.subject,
      success: true,
      actorId: options.actorId,
    });
    return { sent: true as const, fallback: false as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'send_failed';
    await recordEmailDelivery({
      kind,
      to: options.to,
      subject: options.subject,
      success: false,
      error: message,
      actorId: options.actorId,
    });
    throw error;
  }
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

  try {
    await transporter.sendMail({
      from: `QRbanner <${from}>`,
      replyTo: SUPPORT_EMAIL,
      to,
      subject,
      text,
      html,
    });
    await recordEmailDelivery({
      kind: 'verification',
      to,
      subject,
      success: true,
    });
    return { sent: true, fallback: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'send_failed';
    await recordEmailDelivery({
      kind: 'verification',
      to,
      subject,
      success: false,
      error: message,
    });
    throw error;
  }
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
    const result = await deliverMail({ to, subject, text, html, kind: 'password_reset' });
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
    const result = await deliverMail({ to, subject, text, html, kind: 'password_reset_oauth' });
    return result;
  } catch (error) {
    console.error('[email] OAuth reset notice failed:', error);
    throw error;
  }
}

export async function sendTeamInviteEmail(
  to: string,
  payload: import('@/lib/i18n/team-invite-email').TeamInviteEmailPayload,
  locale: import('@/lib/i18n/types').Locale = 'en',
) {
  const { buildTeamInviteEmailContent } = await import('@/lib/i18n/team-invite-email');
  const { subject, html, text } = buildTeamInviteEmailContent(locale, payload);

  if (!getTransporter()) {
    if (isDevEmailFallbackAllowed()) {
      logDevEmailSkipped('team invite', to);
      return { sent: false, fallback: true };
    }
    throw new EmailNotConfiguredError('team invite email');
  }

  try {
    const result = await deliverMail({ to, subject, text, html, kind: 'team_invite' });
    return result;
  } catch (error) {
    console.error('[email] Team invite send failed:', error);
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
  workspaceId?: string | null,
  locale: import('@/lib/i18n/types').Locale = 'en',
): Promise<{ sent: boolean; fallback?: boolean }> {
  const { buildEmailShell } = await import('@/lib/i18n/email-shell');
  const escaped = text.replace(/</g, '&lt;');
  const html = buildEmailShell(
    locale,
    `<p style="font-size:15px;white-space:pre-wrap;margin:0">${escaped}</p>`,
  );
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

export async function sendAdminTestEmail(
  to: string,
  locale: import('@/lib/i18n/types').Locale = 'en',
  actorId?: string | null,
) {
  const { buildAdminSmtpTestEmailContent } = await import('@/lib/i18n/admin-test-email');
  const { subject, html, text } = buildAdminSmtpTestEmailContent(locale);

  if (!getTransporter()) {
    if (isDevEmailFallbackAllowed()) {
      logDevEmailSkipped('admin test', to);
      return { sent: false, fallback: true };
    }
    throw new EmailNotConfiguredError('admin test email');
  }

  return deliverMail({
    to,
    subject,
    text,
    html,
    kind: 'admin_test',
    actorId,
  });
}
