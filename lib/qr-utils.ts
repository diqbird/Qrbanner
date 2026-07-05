import crypto from 'crypto';
import { buildCategoryPayload } from './qr-category-registry';

export { categoryUrlFieldLabel } from './qr-category-registry';
export {
  STATIC_PAYLOAD_CATEGORIES,
  ATTACHMENT_SCAN_META,
  SCHEME_SCAN_CATEGORIES,
  getAttachmentScanMeta,
  isSchemeScanCategory,
} from './qr-category-registry';

export function generateShortCode(length: number = 8): string {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

export const QR_CATEGORIES = [
  { id: 'url', name: 'Website Link', shortName: 'Website', group: 'basic', description: 'Send people to any page — change the link anytime without reprinting', popular: true },
  { id: 'text', name: 'Plain Text', shortName: 'Text', group: 'basic', description: 'Show a message, code or note when someone scans' },
  { id: 'vcard', name: 'Digital Business Card', shortName: 'Contact', group: 'basic', description: 'One scan saves your name, phone and email to their phone', popular: true },
  { id: 'wifi', name: 'Wi‑Fi Access', shortName: 'Wi‑Fi', group: 'basic', description: 'Guests join your network instantly — no typing passwords', popular: true },
  { id: 'email', name: 'Email', shortName: 'Email', group: 'basic', description: 'Open their email app with your address and message ready' },
  { id: 'sms', name: 'Text Message (SMS)', shortName: 'SMS', group: 'basic', description: 'Pre-fill a text message to your phone number' },
  { id: 'phone', name: 'Phone Call', shortName: 'Phone', group: 'basic', description: 'Tap to call your number — great for support and sales' },
  { id: 'location', name: 'Map Location', shortName: 'Location', group: 'basic', description: 'Open directions to your shop, office or event venue' },
  { id: 'event', name: 'Calendar Event', shortName: 'Event', group: 'basic', description: 'Add your event to their calendar with one scan' },
  { id: 'whatsapp', name: 'WhatsApp Chat', shortName: 'WhatsApp', group: 'social', description: 'Start a WhatsApp conversation — optional pre-written message', popular: true },
  { id: 'telegram', name: 'Telegram', shortName: 'Telegram', group: 'social', description: 'Open your Telegram channel or direct chat' },
  { id: 'discord', name: 'Discord Server', shortName: 'Discord', group: 'social', description: 'Join your community with an invite link' },
  { id: 'instagram', name: 'Instagram Profile', shortName: 'Instagram', group: 'social', description: 'Grow followers from packaging, posters and in-store displays', popular: true },
  { id: 'facebook', name: 'Facebook Page', shortName: 'Facebook', group: 'social', description: 'Link to your Facebook page or profile' },
  { id: 'tiktok', name: 'TikTok Profile', shortName: 'TikTok', group: 'social', description: 'Turn offline traffic into TikTok followers' },
  { id: 'linkedin', name: 'LinkedIn Profile', shortName: 'LinkedIn', group: 'social', description: 'Professional networking from cards, badges and brochures' },
  { id: 'youtube', name: 'YouTube Channel', shortName: 'YouTube', group: 'social', description: 'Send viewers to your channel or a specific video' },
  { id: 'spotify', name: 'Spotify', shortName: 'Spotify', group: 'social', description: 'Share a song, album or playlist' },
  { id: 'social', name: 'Other Social Link', shortName: 'Social', group: 'social', description: 'Any social profile or link page URL' },
  { id: 'link_hub', name: 'Link Hub', shortName: 'Link Hub', group: 'social', description: 'One QR with multiple buttons — like Linktree', popular: true },
  { id: 'zoom', name: 'Zoom Meeting', shortName: 'Zoom', group: 'meetings', description: 'Join your Zoom call from posters, slides or email' },
  { id: 'google_meet', name: 'Google Meet', shortName: 'Meet', group: 'meetings', description: 'One scan opens your Google Meet room' },
  { id: 'menu', name: 'Restaurant Menu', shortName: 'Menu', group: 'files', description: 'Digital menu on tables — update prices without reprinting', popular: true },
  { id: 'pdf', name: 'PDF Document', shortName: 'PDF', group: 'files', description: 'Share brochures, menus, CVs or catalogs as a PDF link' },
  { id: 'file', name: 'File Download', shortName: 'File', group: 'files', description: 'Link to any file visitors can download' },
  { id: 'app', name: 'App Download', shortName: 'App', group: 'files', description: 'Send iOS and Android users to the right app store' },
  { id: 'crypto', name: 'Crypto Payment', shortName: 'Crypto', group: 'files', description: 'Bitcoin or Ethereum wallet — no copy-paste errors' },
  { id: 'google_review', name: 'Google Review', shortName: 'Review', group: 'payments', description: 'Send happy customers straight to your Google review page', popular: true },
  { id: 'paypal', name: 'PayPal Payment', shortName: 'PayPal', group: 'payments', description: 'Accept tips and payments via your PayPal.me link' },
  { id: 'upi', name: 'UPI Payment (India)', shortName: 'UPI', group: 'payments', description: 'Instant bank payments via UPI — scan to pay in rupees' },
  { id: 'signal', name: 'Signal Messenger', shortName: 'Signal', group: 'social', description: 'Start a private Signal chat from a poster or card' },
  { id: 'apple_music', name: 'Apple Music', shortName: 'Apple Music', group: 'social', description: 'Share a song, album or artist from Apple Music' },
  { id: 'google_drive', name: 'Google Drive', shortName: 'Drive', group: 'files', description: 'Share a Drive file or folder with one scan' },
  { id: 'dropbox', name: 'Dropbox Link', shortName: 'Dropbox', group: 'files', description: 'Let people open or download from your Dropbox share link' },
  { id: 'gs1', name: 'GS1 Digital Link', shortName: 'GS1', group: 'products', description: 'Product QR with GTIN, batch and expiry — ready for EU Digital Product Passport' },
] as const;

export type QRCategory = (typeof QR_CATEGORIES)[number]['id'];

export const QR_CATEGORY_GROUPS = [
  { id: 'basic', label: 'Everyday', subtitle: 'Links, contacts, Wi‑Fi and more' },
  { id: 'social', label: 'Social & Chat', subtitle: 'Grow followers and start conversations' },
  { id: 'meetings', label: 'Video Calls', subtitle: 'One scan to join your meeting' },
  { id: 'files', label: 'Menus & Files', subtitle: 'Menus, PDFs, apps and payments' },
  { id: 'payments', label: 'Payments & Reviews', subtitle: 'PayPal, UPI, tips and Google reviews' },
  { id: 'products', label: 'Products & Retail', subtitle: 'GS1 product codes and digital passports' },
] as const;

/** Categories that use dynamic short links (editable without reprinting). */
export const DYNAMIC_QR_CATEGORIES = new Set<string>([
  'url', 'text', 'menu', 'social', 'app', 'pdf', 'file', 'link_hub',
  'whatsapp', 'telegram', 'discord', 'instagram', 'facebook', 'tiktok',
  'linkedin', 'youtube', 'spotify', 'zoom', 'google_meet',
  'google_review', 'paypal', 'apple_music', 'google_drive', 'dropbox', 'signal',
]);

export function isDynamicCategory(category: string): boolean {
  return DYNAMIC_QR_CATEGORIES.has(category);
}

export function buildQRPayload(category: string, data: Record<string, any>): string {
  return buildCategoryPayload(category, data);
}

export function categoryDisplayName(category: string): string {
  return QR_CATEGORIES.find((c) => c.id === category)?.name ?? category;
}

export function categoryShortName(category: string): string {
  const cat = QR_CATEGORIES.find((c) => c.id === category);
  return cat?.shortName ?? categoryDisplayName(category);
}

export function isPopularCategory(category: string): boolean {
  const cat = QR_CATEGORIES.find((c) => c.id === category);
  return Boolean(cat && 'popular' in cat && cat.popular);
}

export function parseUserAgent(ua: string | null): { device: string; browser: string; os: string } {
  const uaStr = ua ?? '';
  let device = 'Desktop';
  let browser = 'Unknown';
  let os = 'Unknown';

  if (/Mobile|Android|iPhone|iPad/i.test(uaStr)) device = 'Mobile';
  if (/iPad|Tablet/i.test(uaStr)) device = 'Tablet';

  if (/Chrome/i.test(uaStr) && !/Edge|OPR/i.test(uaStr)) browser = 'Chrome';
  else if (/Firefox/i.test(uaStr)) browser = 'Firefox';
  else if (/Safari/i.test(uaStr) && !/Chrome/i.test(uaStr)) browser = 'Safari';
  else if (/Edge/i.test(uaStr)) browser = 'Edge';
  else if (/OPR|Opera/i.test(uaStr)) browser = 'Opera';

  if (/Windows/i.test(uaStr)) os = 'Windows';
  else if (/Mac OS/i.test(uaStr)) os = 'macOS';
  else if (/Linux/i.test(uaStr) && !/Android/i.test(uaStr)) os = 'Linux';
  else if (/Android/i.test(uaStr)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(uaStr)) os = 'iOS';

  return { device, browser, os };
}
