import { translate, type Locale } from '@/lib/i18n';
import { buildEmailShell } from '@/lib/i18n/email-shell';

function t(locale: Locale, key: string, vars?: Record<string, string | number>) {
  return translate(locale, key, vars);
}

export function buildStudioDeliveryEmailContent(
  locale: Locale,
  input: { url: string; maxQr: number; buyerEmail: string },
) {
  const vars = {
    url: input.url,
    maxQr: input.maxQr,
    buyerEmail: input.buyerEmail,
  };

  const subject = t(locale, 'studioDeliveryEmail.subject', vars);
  const greeting = t(locale, 'studioDeliveryEmail.greeting');
  const intro = t(locale, 'studioDeliveryEmail.intro', vars);
  const cta = t(locale, 'studioDeliveryEmail.cta');
  const importantTitle = t(locale, 'studioDeliveryEmail.importantTitle');
  const bullet1 = t(locale, 'studioDeliveryEmail.bullet1');
  const bullet2 = t(locale, 'studioDeliveryEmail.bullet2', vars);
  const bullet3 = t(locale, 'studioDeliveryEmail.bullet3');
  const footer = t(locale, 'studioDeliveryEmail.footer');
  const text = t(locale, 'studioDeliveryEmail.text', vars);

  const body = `
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px">${greeting}</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px">${intro}</p>
      <p style="margin:24px 0"><a href="${input.url}" style="display:inline-block;background:#004485;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px">${cta}</a></p>
      <p style="font-size:13px;color:#64748b;word-break:break-all;margin:0 0 16px">${input.url}</p>
      <p style="font-size:14px;line-height:1.6;margin:0 0 8px"><strong>${importantTitle}</strong></p>
      <ul style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 16px;padding-left:20px">
        <li>${bullet1}</li>
        <li>${bullet2}</li>
        <li>${bullet3}</li>
      </ul>
      <p style="font-size:14px;color:#64748b;margin:0">${footer}</p>`;

  return {
    subject,
    html: buildEmailShell(locale, body),
    text,
  };
}
