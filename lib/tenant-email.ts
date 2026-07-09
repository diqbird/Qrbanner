import nodemailer from 'nodemailer';
import { buildSmtpTestEmailContent } from '@/lib/i18n/smtp-test-email';
import type { Locale } from '@/lib/i18n/types';
import type { Transporter } from 'nodemailer';
import { createSmtpTransport, smtpFromAddress } from '@/lib/smtp-transport';
import { prisma } from '@/lib/db';
import { decryptSecret } from '@/lib/secret-crypto';
import { ENTERPRISE_SMTP_SCOPE } from '@/lib/workspace-enterprise';

export type TenantMailOptions = {
  workspaceId?: string | null;
  to: string;
  subject: string;
  text: string;
  html: string;
  fromName?: string;
};

function getGlobalTransporter(): Transporter | null {
  return createSmtpTransport();
}

async function getWorkspaceTransporter(workspaceId: string): Promise<{
  transporter: Transporter;
  from: string;
} | null> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      smtpEnabled: true,
      smtpHost: true,
      smtpPort: true,
      smtpUser: true,
      smtpPasswordEnc: true,
      smtpFrom: true,
    },
  });
  if (!workspace?.smtpEnabled || !workspace.smtpHost || !workspace.smtpUser) return null;

  const pass = decryptSecret(workspace.smtpPasswordEnc, ENTERPRISE_SMTP_SCOPE);
  if (!pass) return null;

  const port = workspace.smtpPort ?? 587;
  const transporter = nodemailer.createTransport({
    host: workspace.smtpHost,
    port,
    secure: port === 465,
    auth: { user: workspace.smtpUser, pass },
  });
  const from = workspace.smtpFrom || workspace.smtpUser;
  return { transporter, from };
}

export async function sendTenantMail(
  opts: TenantMailOptions
): Promise<{ sent: boolean; fallback?: boolean; tenant?: boolean }> {
  const fromName = opts.fromName ?? 'QRbanner';
  let transporter: Transporter | null = null;
  let from = smtpFromAddress();
  let usedTenant = false;

  if (opts.workspaceId) {
    const tenant = await getWorkspaceTransporter(opts.workspaceId);
    if (tenant) {
      transporter = tenant.transporter;
      from = tenant.from;
      usedTenant = true;
    }
  }

  if (!transporter) {
    transporter = getGlobalTransporter();
  }

  if (!transporter) {
    console.log(`[email] SMTP not configured. Mail to ${opts.to}: ${opts.subject}`);
    return { sent: false, fallback: true, tenant: usedTenant };
  }

  await transporter.sendMail({
    from: `${fromName} <${from}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });

  return { sent: true, fallback: false, tenant: usedTenant };
}

export async function testWorkspaceSmtp(
  workspaceId: string,
  to: string,
  locale: Locale = 'en',
): Promise<{ sent: boolean }> {
  const { resolveWorkspaceEmailBrand } = await import('@/lib/email-branding');
  const brand = await resolveWorkspaceEmailBrand(workspaceId);
  const { subject, text, html } = buildSmtpTestEmailContent(locale);
  const result = await sendTenantMail({
    workspaceId,
    to,
    subject,
    text,
    html,
    fromName: brand.fromName,
  });
  return { sent: result.sent };
}
