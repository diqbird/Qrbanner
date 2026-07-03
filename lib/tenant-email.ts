import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
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
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
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
  let from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@qrbanner.com';
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

export async function testWorkspaceSmtp(workspaceId: string, to: string): Promise<{ sent: boolean }> {
  const result = await sendTenantMail({
    workspaceId,
    to,
    subject: 'QRbanner SMTP test',
    text: 'Your workspace SMTP configuration is working.',
    html: '<p>Your workspace SMTP configuration is working.</p>',
    fromName: 'QRbanner',
  });
  return { sent: result.sent };
}
