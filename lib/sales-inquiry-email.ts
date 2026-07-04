import { createSmtpTransport, smtpFromAddress } from '@/lib/smtp-transport';
import { SUPPORT_EMAIL } from '@/lib/site-contact';

function getTransporter() {
  return createSmtpTransport();
}

export interface SalesInquiryPayload {
  type: 'enterprise' | 'demo' | 'general';
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}

export type SalesInquirySendResult = {
  sent: boolean;
  fallback: boolean;
};

export async function sendSalesInquiryEmail(
  payload: SalesInquiryPayload
): Promise<SalesInquirySendResult> {
  const transporter = getTransporter();
  const from = smtpFromAddress();
  const to = process.env.SALES_INBOX || SUPPORT_EMAIL;

  const typeLabel =
    payload.type === 'enterprise' ? 'Enterprise' : payload.type === 'demo' ? 'Demo request' : 'General';

  const subject = `[QRbanner ${typeLabel}] ${payload.company || payload.name}`;
  const text = [
    `Type: ${typeLabel}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : null,
    payload.phone ? `Phone: ${payload.phone}` : null,
    '',
    payload.message,
  ]
    .filter(Boolean)
    .join('\n');

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
    });
    return { sent: true, fallback: false };
  } catch (err) {
    console.error('[email] Sales inquiry SMTP send failed:', err);
    logFallback();
    return { sent: false, fallback: true };
  }
}
