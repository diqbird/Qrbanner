export const SUPPORT_EMAIL = 'support@qrbanner.com';
export const LEGAL_EMAIL = 'legal@qrbanner.com';
export const PRIVACY_EMAIL = 'privacy@qrbanner.com';

/** Set NEXT_PUBLIC_DEMO_BOOKING_URL to your Calendly (or similar) link. */
export const DEMO_BOOKING_URL =
  process.env.NEXT_PUBLIC_DEMO_BOOKING_URL?.trim() || '/contact?demo=1';

/** E.g. https://wa.me/15551234567 — leave empty to hide WhatsApp button */
export const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() || '';

export const supportMailto = (subject = 'QRbanner Support') =>
  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;

export const demoBookingUrl = () => DEMO_BOOKING_URL;

export const whatsappUrl = () => WHATSAPP_URL;
