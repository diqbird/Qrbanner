/** Human inbox: support, legal, privacy, sales, DMARC aggregate reports */
export const SUPPORT_EMAIL = 'support@qrbanner.com';

/** Transactional SMTP sender (password reset, verification, notifications) */
export const NOREPLY_EMAIL = 'noreply@qrbanner.com';

/** Legal/privacy inquiries — routed to the support inbox */
export const LEGAL_EMAIL = SUPPORT_EMAIL;
export const PRIVACY_EMAIL = SUPPORT_EMAIL;

/** DMARC aggregate report destination (rua=) */
export const DMARC_REPORT_EMAIL = SUPPORT_EMAIL;

/** Set NEXT_PUBLIC_DEMO_BOOKING_URL to your Calendly (or similar) link. */
export const DEMO_BOOKING_URL =
  process.env.NEXT_PUBLIC_DEMO_BOOKING_URL?.trim() || '/contact?demo=1';

/** E.g. https://wa.me/15551234567 — leave empty to hide WhatsApp button */
export const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() || '';

export const supportMailto = (subject = 'QRbanner Support', email = SUPPORT_EMAIL) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}`;

export const demoBookingUrl = () => DEMO_BOOKING_URL;

export const whatsappUrl = () => WHATSAPP_URL;
