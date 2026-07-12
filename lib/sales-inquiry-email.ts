import { createSmtpTransport, smtpFromAddress } from '@/lib/smtp-transport';
import { SUPPORT_EMAIL } from '@/lib/site-contact';
import { translate, type Locale } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/types';
import { buildEmailShell } from '@/lib/i18n/email-shell';
import type { SalesInquiryType } from '@/lib/inquiry-types';

function getTransporter() {
  return createSmtpTransport();
}

export interface SalesInquiryPayload {
  type: SalesInquiryType;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  needsSla?: boolean;
  needsCsm?: boolean;
  locale?: Locale;
}

export type SalesInquirySendResult = {
  sent: boolean;
  fallback: boolean;
};

const TYPE_LABEL_KEYS: Record<SalesInquiryType, string> = {
  enterprise: 'salesInquiryEmail.typeEnterprise',
  demo: 'salesInquiryEmail.typeDemo',
  general: 'salesInquiryEmail.typeGeneral',
  security_questionnaire: 'salesInquiryEmail.typeSecurityQuestionnaire',
  baa: 'salesInquiryEmail.typeBaa',
  dpa_request: 'salesInquiryEmail.typeDpaRequest',
};

function typeLabel(locale: Locale, type: SalesInquiryType): string {
  return translate(locale, TYPE_LABEL_KEYS[type]);
}

export async function sendSalesInquiryEmail(
  payload: SalesInquiryPayload
): Promise<SalesInquirySendResult> {
  const transporter = getTransporter();
  const from = smtpFromAddress();
  const to = process.env.SALES_INBOX || SUPPORT_EMAIL;
  const locale: Locale = isLocale(payload.locale) ? payload.locale : 'en';
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);

  const type = typeLabel(locale, payload.type);
  const companyOrName = payload.company || payload.name;
  const subject = t('salesInquiryEmail.subject', { type, companyOrName });

  const lines: string[] = [
    `${t('salesInquiryEmail.labelType')}: ${type}`,
    `${t('salesInquiryEmail.labelName')}: ${payload.name}`,
    `${t('salesInquiryEmail.labelEmail')}: ${payload.email}`,
    ...(payload.company ? [`${t('salesInquiryEmail.labelCompany')}: ${payload.company}`] : []),
    ...(payload.phone ? [`${t('salesInquiryEmail.labelPhone')}: ${payload.phone}`] : []),
    ...(payload.needsSla ? [`${t('salesInquiryEmail.labelNeedsSla')}: ${t('salesInquiryEmail.yes')}`] : []),
    ...(payload.needsCsm ? [`${t('salesInquiryEmail.labelNeedsCsm')}: ${t('salesInquiryEmail.yes')}`] : []),
    '',
    payload.message,
  ];

  const text = lines.join('\n');
  const htmlBody = lines
    .map((line) => `<p style="font-size:14px;margin:0 0 8px;white-space:pre-wrap">${line.replace(/</g, '&lt;')}</p>`)
    .join('');
  const html = buildEmailShell(locale, htmlBody);

  const logFallback = () => {
    console.log(`[email] Sales inquiry logged (delivery fallback):\n${text}`);
  };

  if (!transporter) {
    logFallback();
    return { sent: false, fallback: true };
  }

  try {
    await transporter.sendMail({
      from: `QRbanner <${from}>`,
      to,
      replyTo: payload.email,
      subject,
      text,
      html,
    });
    return { sent: true, fallback: false };
  } catch (err) {
    console.error('[email] Sales inquiry SMTP send failed:', err);
    logFallback();
    return { sent: false, fallback: true };
  }
}
