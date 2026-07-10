import type { Locale } from '@/lib/i18n/types';
import { buildEmailShell } from '@/lib/i18n/email-shell';

export function buildStudioDeliveryEmailContent(
  locale: Locale,
  input: { url: string; maxQr: number; buyerEmail: string },
) {
  const isTr = locale === 'tr';
  const subject = isTr
    ? `Premium QR Studio paketiniz (${input.maxQr} kod)`
    : `Your Premium QR Studio pack (${input.maxQr} QR codes)`;

  const body = isTr
    ? `
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Merhaba,</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Etsy siparişiniz onaylandı. <strong>${input.maxQr} dinamik QR kodu</strong> oluşturmak için Premium Studio linkiniz:</p>
      <p style="margin:24px 0"><a href="${input.url}" style="display:inline-block;background:#004485;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px">Studio'yu aç</a></p>
      <p style="font-size:13px;color:#64748b;word-break:break-all;margin:0 0 16px">${input.url}</p>
      <p style="font-size:14px;line-height:1.6;margin:0 0 8px"><strong>Önemli:</strong></p>
      <ul style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 16px;padding-left:20px">
        <li>Bu link <strong>tek seferlik</strong> aktivasyon içindir.</li>
        <li>Kayıt/giriş için <strong>${input.buyerEmail}</strong> e-postasını kullanın.</li>
        <li>35+ sektör şablonu, tasarım araçları ve analitik dahildir.</li>
      </ul>
      <p style="font-size:14px;color:#64748b;margin:0">Sorularınız için bu e-postaya yanıt verebilir veya Etsy üzerinden yazabilirsiniz.</p>
    `
    : `
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Hello,</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Your Etsy order has been approved. Use your private Premium Studio link to create <strong>${input.maxQr} dynamic QR codes</strong>:</p>
      <p style="margin:24px 0"><a href="${input.url}" style="display:inline-block;background:#004485;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px">Open Premium Studio</a></p>
      <p style="font-size:13px;color:#64748b;word-break:break-all;margin:0 0 16px">${input.url}</p>
      <p style="font-size:14px;line-height:1.6;margin:0 0 8px"><strong>Important:</strong></p>
      <ul style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 16px;padding-left:20px">
        <li>This link is for <strong>one-time activation</strong> per purchase.</li>
        <li>Sign in or register with <strong>${input.buyerEmail}</strong> (your order email).</li>
        <li>Includes 35+ industry templates, full design tools &amp; scan analytics.</li>
      </ul>
      <p style="font-size:14px;color:#64748b;margin:0">Reply to this email or message us on Etsy if you need help.</p>
    `;

  const text = isTr
    ? `Etsy siparişiniz onaylandı.\n\nStudio linki: ${input.url}\n\n${input.maxQr} dinamik QR kodu. E-posta: ${input.buyerEmail}\nTek seferlik aktivasyon.`
    : `Your Etsy order is approved.\n\nStudio link: ${input.url}\n\n${input.maxQr} dynamic QR codes. Use email: ${input.buyerEmail}\nOne-time activation.`;

  return {
    subject,
    html: buildEmailShell(locale, body),
    text,
  };
}
