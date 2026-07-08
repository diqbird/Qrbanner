import { translate, type Locale } from '@/lib/i18n';
import { buildEmailShell } from '@/lib/i18n/email-shell';

function t(locale: Locale, key: string, vars?: Record<string, string | number>) {
  return translate(locale, key, vars);
}

function roleLabel(locale: Locale, role: string): string {
  const key = `teamInviteEmail.roles.${role}`;
  const label = translate(locale, key);
  return label === key ? role : label;
}

export interface TeamInviteEmailPayload {
  workspaceName: string;
  inviterName: string;
  role: string;
  inviteUrl: string;
}

export function buildTeamInviteEmailContent(
  locale: Locale,
  payload: TeamInviteEmailPayload,
): { subject: string; html: string; text: string } {
  const role = roleLabel(locale, payload.role);
  const subject = t(locale, 'teamInviteEmail.subject', { workspace: payload.workspaceName });
  const greeting = t(locale, 'teamInviteEmail.greeting');
  const intro = t(locale, 'teamInviteEmail.intro', {
    inviter: payload.inviterName,
    workspace: payload.workspaceName,
    role,
  });
  const cta = t(locale, 'teamInviteEmail.cta');
  const expiryNote = t(locale, 'teamInviteEmail.expiryNote');
  const text = t(locale, 'teamInviteEmail.text', {
    inviter: payload.inviterName,
    workspace: payload.workspaceName,
    role,
    inviteUrl: payload.inviteUrl,
  });

  const html = buildEmailShell(
    locale,
    `
    <p style="font-size:15px">${greeting}</p>
    <p style="font-size:15px">${intro}</p>
    <div style="text-align:center;margin:28px 0">
      <a href="${payload.inviteUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600">${cta}</a>
    </div>
    <p style="font-size:13px;color:#64748b">${expiryNote}</p>`,
  );

  return { subject, html, text };
}
