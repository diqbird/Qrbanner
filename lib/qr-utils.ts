import crypto from 'crypto';

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
] as const;

export type QRCategory = (typeof QR_CATEGORIES)[number]['id'];

export const QR_CATEGORY_GROUPS = [
  { id: 'basic', label: 'Everyday', subtitle: 'Links, contacts, Wi‑Fi and more' },
  { id: 'social', label: 'Social & Chat', subtitle: 'Grow followers and start conversations' },
  { id: 'meetings', label: 'Video Calls', subtitle: 'One scan to join your meeting' },
  { id: 'files', label: 'Menus & Files', subtitle: 'Menus, PDFs, apps and payments' },
] as const;

/** Categories that use dynamic short links (editable without reprinting). */
export const DYNAMIC_QR_CATEGORIES = new Set<string>([
  'url', 'text', 'menu', 'social', 'app', 'pdf', 'file', 'link_hub',
  'whatsapp', 'telegram', 'discord', 'instagram', 'facebook', 'tiktok',
  'linkedin', 'youtube', 'spotify', 'zoom', 'google_meet',
]);

export function isDynamicCategory(category: string): boolean {
  return DYNAMIC_QR_CATEGORIES.has(category);
}

function stripAt(s: string): string {
  return (s ?? '').trim().replace(/^@/, '');
}

function normalizeUrl(url: string): string {
  const t = (url ?? '').trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

export function buildQRPayload(category: string, data: Record<string, any>): string {
  switch (category) {
    case 'url':
    case 'menu':
    case 'social':
    case 'app':
    case 'pdf':
    case 'file':
    case 'link_hub':
      return normalizeUrl(data?.url ?? '');
    case 'text':
      return (data?.text ?? '').trim();
    case 'vcard': {
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${data?.lastName ?? ''};${data?.firstName ?? ''}`,
        `FN:${data?.firstName ?? ''} ${data?.lastName ?? ''}`,
        data?.org ? `ORG:${data.org}` : '',
        data?.title ? `TITLE:${data.title}` : '',
        data?.phone ? `TEL:${data.phone}` : '',
        data?.email ? `EMAIL:${data.email}` : '',
        data?.website ? `URL:${data.website}` : '',
        data?.address ? `ADR:;;${data.address}` : '',
        'END:VCARD',
      ].filter(Boolean);
      return lines.join('\n');
    }
    case 'wifi':
      return `WIFI:T:${data?.encryption ?? 'WPA'};S:${data?.ssid ?? ''};P:${data?.password ?? ''};H:${data?.hidden ? 'true' : 'false'};;`;
    case 'email':
      return `mailto:${data?.email ?? ''}?subject=${encodeURIComponent(data?.subject ?? '')}&body=${encodeURIComponent(data?.body ?? '')}`;
    case 'sms':
      return `sms:${data?.phone ?? ''}?body=${encodeURIComponent(data?.message ?? '')}`;
    case 'phone':
      return `tel:${(data?.phone ?? '').replace(/\s/g, '')}`;
    case 'location': {
      const lat = parseFloat(data?.latitude ?? '');
      const lng = parseFloat(data?.longitude ?? '');
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return '';
      const label = encodeURIComponent(data?.label ?? `${lat},${lng}`);
      return `geo:${lat},${lng}?q=${label}`;
    }
    case 'event': {
      const lines = [
        'BEGIN:VCALENDAR',
        'BEGIN:VEVENT',
        `SUMMARY:${data?.title ?? ''}`,
        `LOCATION:${data?.location ?? ''}`,
        `DESCRIPTION:${data?.description ?? ''}`,
        data?.startDate ? `DTSTART:${data.startDate.replace(/[-:]/g, '').replace('T', 'T')}` : '',
        data?.endDate ? `DTEND:${data.endDate.replace(/[-:]/g, '').replace('T', 'T')}` : '',
        'END:VEVENT',
        'END:VCALENDAR',
      ].filter(Boolean);
      return lines.join('\n');
    }
    case 'whatsapp': {
      const phone = (data?.phone ?? '').replace(/\D/g, '');
      const msg = data?.message ? `?text=${encodeURIComponent(data.message)}` : '';
      return phone ? `https://wa.me/${phone}${msg}` : '';
    }
    case 'telegram': {
      const user = stripAt(data?.username ?? '');
      return user ? `https://t.me/${user}` : '';
    }
    case 'discord': {
      const code = stripAt(data?.inviteCode ?? data?.username ?? '');
      return code ? `https://discord.gg/${code}` : '';
    }
    case 'instagram': {
      const user = stripAt(data?.username ?? '');
      return user ? `https://instagram.com/${user}` : normalizeUrl(data?.url ?? '');
    }
    case 'facebook': {
      const user = stripAt(data?.username ?? '');
      return user ? `https://facebook.com/${user}` : normalizeUrl(data?.url ?? '');
    }
    case 'tiktok': {
      const user = stripAt(data?.username ?? '');
      return user ? `https://tiktok.com/@${user}` : normalizeUrl(data?.url ?? '');
    }
    case 'linkedin': {
      const slug = stripAt(data?.username ?? '');
      return slug ? `https://linkedin.com/in/${slug}` : normalizeUrl(data?.url ?? '');
    }
    case 'youtube': {
      const url = data?.url?.trim();
      if (url) return normalizeUrl(url);
      const handle = stripAt(data?.username ?? '');
      return handle ? `https://youtube.com/@${handle}` : '';
    }
    case 'spotify': {
      const url = data?.url?.trim();
      if (url) return normalizeUrl(url);
      const uri = (data?.uri ?? '').trim();
      if (uri.startsWith('spotify:')) return `https://open.spotify.com/${uri.replace('spotify:', '').replace(':', '/')}`;
      return '';
    }
    case 'zoom': {
      const id = (data?.meetingId ?? '').replace(/\s/g, '');
      if (!id) return '';
      const pwd = data?.password ? `?pwd=${encodeURIComponent(data.password)}` : '';
      return `https://zoom.us/j/${id}${pwd}`;
    }
    case 'google_meet': {
      const code = (data?.meetingCode ?? '').replace(/\s/g, '').toLowerCase();
      return code ? `https://meet.google.com/${code}` : '';
    }
    case 'crypto': {
      const type = (data?.coin ?? 'btc').toLowerCase();
      const address = (data?.address ?? '').trim();
      if (!address) return '';
      const amount = data?.amount ? `?amount=${encodeURIComponent(data.amount)}` : '';
      if (type === 'eth' || type === 'ethereum') return `ethereum:${address}${amount}`;
      return `bitcoin:${address}${amount}`;
    }
    default:
      return data?.url ?? data?.text ?? '';
  }
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

export function categoryUrlFieldLabel(category: string): string {
  switch (category) {
    case 'menu':
      return 'Menu link (website or PDF)';
    case 'pdf':
      return 'PDF file link';
    case 'file':
      return 'Download link';
    case 'app':
      return 'App store link';
    case 'social':
      return 'Social profile link';
    default:
      return 'Website URL';
  }
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
