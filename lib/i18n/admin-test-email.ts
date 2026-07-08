import { translate, type Locale } from '@/lib/i18n';
import { buildEmailShell } from '@/lib/i18n/email-shell';

export function buildAdminSmtpTestEmailContent(locale: Locale): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = translate(locale, 'superAdmin.notifications.testEmailSubject');
  const body = translate(locale, 'superAdmin.notifications.testEmailBody');
  const text = translate(locale, 'superAdmin.notifications.testEmailText');

  const html = buildEmailShell(
    locale,
    `<p style="font-size:15px">${body}</p>`,
  );

  return { subject, text, html };
}
