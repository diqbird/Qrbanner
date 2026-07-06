import { translate, type Locale } from '@/lib/i18n';

export function buildSmtpTestEmailContent(locale: Locale): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = translate(locale, 'enterpriseWorkspace.smtpTestSubject');
  const body = translate(locale, 'enterpriseWorkspace.smtpTestBody');
  return {
    subject: subject === 'enterpriseWorkspace.smtpTestSubject' ? 'QRbanner SMTP test' : subject,
    text: body === 'enterpriseWorkspace.smtpTestBody'
      ? 'Your workspace SMTP configuration is working.'
      : body,
    html: `<p>${body === 'enterpriseWorkspace.smtpTestBody' ? 'Your workspace SMTP configuration is working.' : body}</p>`,
  };
}
