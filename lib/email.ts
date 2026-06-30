import nodemailer from 'nodemailer';

/**
 * SMTP email sending for QRbanner.
 *
 * Configure these environment variables on your VPS (e.g. Hostinger email,
 * Gmail, or any SMTP provider):
 *   SMTP_HOST      e.g. smtp.hostinger.com
 *   SMTP_PORT      e.g. 465 (SSL) or 587 (TLS)
 *   SMTP_USER      e.g. no-reply@qrbanner.com
 *   SMTP_PASSWORD  the mailbox password
 *   SMTP_FROM      (optional) display From, defaults to SMTP_USER
 *
 * If SMTP is not configured, the verification code is logged to the server
 * console as a development fallback so signup/login still works.
 */

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587/25
    auth: { user, pass },
  });
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

export async function sendVerificationEmail(to: string, code: string, name?: string | null) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@qrbanner.com';
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
    // Development fallback: no SMTP configured
    console.log(
      `[email] SMTP not configured. Verification code for ${to}: ${code} (set SMTP_HOST/SMTP_USER/SMTP_PASSWORD to send real emails)`
    );
    return { sent: false, fallback: true };
  }

  await transporter.sendMail({
    from: `QRbanner <${from}>`,
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

export async function sendPasswordResetEmail(to: string, token: string, name?: string | null) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@qrbanner.com';
  const greeting = name ? `Hi ${name},` : 'Hi,';
  const resetUrl = `${siteBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0f172a">
    <div style="text-align:center;margin-bottom:24px">
      <div style="display:inline-block;width:48px;height:48px;line-height:48px;background:#4f46e5;color:#fff;border-radius:12px;font-size:24px">▣</div>
      <h1 style="font-size:20px;margin:12px 0 0">QRbanner</h1>
    </div>
    <p style="font-size:15px">${greeting}</p>
    <p style="font-size:15px">We received a request to reset your password. Click the button below to choose a new password:</p>
    <div style="text-align:center;margin:28px 0">
      <a href="${resetUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:600">Reset Password</a>
    </div>
    <p style="font-size:13px;color:#64748b">This link expires in 1 hour. If you didn't request a reset, you can ignore this email.</p>
    <p style="font-size:12px;color:#94a3b8;word-break:break-all">${resetUrl}</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
    <p style="font-size:12px;color:#94a3b8;text-align:center">&copy; ${new Date().getFullYear()} QRbanner</p>
  </div>`;

  if (!transporter) {
    console.log(
      `[email] SMTP not configured. Password reset for ${to}: ${resetUrl}`
    );
    return { sent: false, fallback: true, resetUrl };
  }

  await transporter.sendMail({
    from: `QRbanner <${from}>`,
    to,
    subject: 'Reset your QRbanner password',
    text: `Reset your password: ${resetUrl} (expires in 1 hour)`,
    html,
  });

  return { sent: true, fallback: false };
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

export async function sendScanNotificationEmail(to: string, payload: ScanNotificationPayload) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@qrbanner.com';
  const greeting = payload.userName ? `Hi ${payload.userName},` : 'Hi,';

  const titles: Record<string, string> = {
    first: '🎉 Your QR code was scanned for the first time!',
    milestone: `🏆 Milestone reached: ${payload.milestone} scans!`,
    every: `📱 New scan on "${payload.qrName}"`,
  };

  const headline = titles[payload.reason] || 'New QR scan';
  const location = [payload.city, payload.country].filter(Boolean).join(', ') || 'Unknown location';
  const deviceInfo = [payload.device, payload.os].filter(Boolean).join(' · ') || 'Unknown device';

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1d1d1f">
    <div style="text-align:center;margin-bottom:24px">
      <div style="display:inline-block;width:48px;height:48px;line-height:48px;background:#0071e3;color:#fff;border-radius:14px;font-size:22px">▣</div>
      <h1 style="font-size:18px;margin:12px 0 0;font-weight:600">QRbanner</h1>
    </div>
    <h2 style="font-size:20px;font-weight:700;margin:0 0 16px;letter-spacing:-.02em">${headline}</h2>
    <p style="font-size:15px;line-height:1.5">${greeting}</p>
    <p style="font-size:15px;line-height:1.5">Your QR code <strong>${payload.qrName}</strong> was just scanned.</p>
    <div style="background:#f5f5f7;border-radius:12px;padding:16px 20px;margin:20px 0">
      <table style="width:100%;font-size:14px;border-collapse:collapse">
        <tr><td style="padding:6px 0;color:#6e6e73">Total scans</td><td style="padding:6px 0;text-align:right;font-weight:600">${payload.totalScans}</td></tr>
        <tr><td style="padding:6px 0;color:#6e6e73">Location</td><td style="padding:6px 0;text-align:right">${location}</td></tr>
        <tr><td style="padding:6px 0;color:#6e6e73">Device</td><td style="padding:6px 0;text-align:right">${deviceInfo}</td></tr>
      </table>
    </div>
    <div style="text-align:center;margin:28px 0">
      <a href="${payload.analyticsUrl}" style="display:inline-block;background:#0071e3;color:#fff;text-decoration:none;padding:12px 28px;border-radius:980px;font-size:15px;font-weight:600">View Analytics</a>
    </div>
    <p style="font-size:12px;color:#86868b;text-align:center">Manage notifications in your QR code settings on QRbanner.</p>
    <hr style="border:none;border-top:1px solid #e5e5ea;margin:24px 0" />
    <p style="font-size:11px;color:#aeaeb2;text-align:center">&copy; ${new Date().getFullYear()} QRbanner</p>
  </div>`;

  const subject =
    payload.reason === 'first'
      ? `First scan: ${payload.qrName}`
      : payload.reason === 'milestone'
      ? `${payload.milestone} scans: ${payload.qrName}`
      : `New scan: ${payload.qrName}`;

  if (!transporter) {
    console.log(`[email] Scan notification for ${to}: ${subject} (SMTP not configured)`);
    return { sent: false, fallback: true };
  }

  await transporter.sendMail({
    from: `QRbanner <${from}>`,
    to,
    subject,
    text: `${headline}\n\nQR: ${payload.qrName}\nTotal scans: ${payload.totalScans}\nLocation: ${location}\nDevice: ${deviceInfo}\n\nAnalytics: ${payload.analyticsUrl}`,
    html,
  });

  return { sent: true, fallback: false };
}
