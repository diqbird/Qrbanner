import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

function envValue(key: string): string | undefined {
  const raw = process.env[key];
  if (raw == null) return undefined;
  let v = raw.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  return v || undefined;
}

/** Shared SMTP transport — Hostinger-friendly (465 SSL or 587 STARTTLS). */
export function createSmtpTransport(): Transporter | null {
  const host = envValue('SMTP_HOST');
  const user = envValue('SMTP_USER');
  const pass = envValue('SMTP_PASSWORD');
  if (!host || !user || !pass) return null;

  const port = parseInt(envValue('SMTP_PORT') || '465', 10);
  const secureFlag = envValue('SMTP_SECURE');
  const secure =
    secureFlag === 'true' || (secureFlag !== 'false' && port === 465);

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...(port === 587 && !secure
      ? { requireTLS: true, tls: { minVersion: 'TLSv1.2' } }
      : { tls: { minVersion: 'TLSv1.2' } }),
  });
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    envValue('SMTP_HOST') && envValue('SMTP_USER') && envValue('SMTP_PASSWORD')
  );
}

export function smtpFromAddress(): string {
  return envValue('SMTP_FROM') || envValue('SMTP_USER') || 'noreply@qrbanner.com';
}
