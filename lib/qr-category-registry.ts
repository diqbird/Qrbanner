import { buildGs1DigitalLink } from './gs1';

export type QrPayloadData = Record<string, unknown>;

export type PayloadBuilder = (data: QrPayloadData) => string;

export type AttachmentScanMeta = {
  contentType: string;
  fileName: string;
};

function stripAt(s: string): string {
  return (s ?? '').trim().replace(/^@/, '');
}

function normalizeUrl(url: string): string {
  const t = (url ?? '').trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

function escapeStructuredText(value: unknown): string {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\n');
}

function escapeWifiField(value: unknown): string {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/:/g, '\\:')
    .replace(/"/g, '\\"');
}

const urlPayload: PayloadBuilder = (data) => normalizeUrl(String(data?.url ?? ''));

const PAYLOAD_BUILDERS: Record<string, PayloadBuilder> = {
  url: urlPayload,
  menu: urlPayload,
  social: urlPayload,
  app: urlPayload,
  pdf: urlPayload,
  file: urlPayload,
  link_hub: urlPayload,
  apple_music: urlPayload,
  google_drive: urlPayload,
  dropbox: urlPayload,
  text: (data) => String(data?.text ?? '').trim(),
  vcard: (data) => {
    const firstName = escapeStructuredText(data?.firstName);
    const lastName = escapeStructuredText(data?.lastName);
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${lastName};${firstName}`,
      `FN:${escapeStructuredText(`${data?.firstName ?? ''} ${data?.lastName ?? ''}`.trim())}`,
      data?.org ? `ORG:${escapeStructuredText(data.org)}` : '',
      data?.title ? `TITLE:${escapeStructuredText(data.title)}` : '',
      data?.phone ? `TEL:${escapeStructuredText(data.phone)}` : '',
      data?.email ? `EMAIL:${escapeStructuredText(data.email)}` : '',
      data?.website ? `URL:${normalizeUrl(String(data.website))}` : '',
      data?.address ? `ADR:;;${escapeStructuredText(data.address)}` : '',
      'END:VCARD',
    ].filter(Boolean);
    return lines.join('\n');
  },
  wifi: (data) =>
    `WIFI:T:${escapeWifiField(data?.encryption ?? 'WPA')};S:${escapeWifiField(data?.ssid ?? '')};P:${escapeWifiField(data?.password ?? '')};H:${data?.hidden ? 'true' : 'false'};;`,
  email: (data) =>
    `mailto:${data?.email ?? ''}?subject=${encodeURIComponent(String(data?.subject ?? ''))}&body=${encodeURIComponent(String(data?.body ?? ''))}`,
  sms: (data) =>
    `sms:${data?.phone ?? ''}?body=${encodeURIComponent(String(data?.message ?? ''))}`,
  phone: (data) => `tel:${String(data?.phone ?? '').replace(/\s/g, '')}`,
  location: (data) => {
    const lat = parseFloat(String(data?.latitude ?? ''));
    const lng = parseFloat(String(data?.longitude ?? ''));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return '';
    const label = encodeURIComponent(String(data?.label ?? `${lat},${lng}`));
    return `geo:${lat},${lng}?q=${label}`;
  },
  event: (data) => {
    const lines = [
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      `SUMMARY:${escapeStructuredText(data?.title)}`,
      `LOCATION:${escapeStructuredText(data?.location)}`,
      `DESCRIPTION:${escapeStructuredText(data?.description)}`,
      data?.startDate
        ? `DTSTART:${String(data.startDate).replace(/[-:]/g, '').replace('T', 'T')}`
        : '',
      data?.endDate ? `DTEND:${String(data.endDate).replace(/[-:]/g, '').replace('T', 'T')}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean);
    return lines.join('\n');
  },
  whatsapp: (data) => {
    const phone = String(data?.phone ?? '').replace(/\D/g, '');
    const msg = data?.message ? `?text=${encodeURIComponent(String(data.message))}` : '';
    return phone ? `https://wa.me/${phone}${msg}` : '';
  },
  telegram: (data) => {
    const user = stripAt(String(data?.username ?? ''));
    return user ? `https://t.me/${user}` : '';
  },
  discord: (data) => {
    const code = stripAt(String(data?.inviteCode ?? data?.username ?? ''));
    return code ? `https://discord.gg/${code}` : '';
  },
  instagram: (data) => {
    const user = stripAt(String(data?.username ?? ''));
    return user ? `https://instagram.com/${user}` : normalizeUrl(String(data?.url ?? ''));
  },
  facebook: (data) => {
    const user = stripAt(String(data?.username ?? ''));
    return user ? `https://facebook.com/${user}` : normalizeUrl(String(data?.url ?? ''));
  },
  tiktok: (data) => {
    const user = stripAt(String(data?.username ?? ''));
    return user ? `https://tiktok.com/@${user}` : normalizeUrl(String(data?.url ?? ''));
  },
  linkedin: (data) => {
    const slug = stripAt(String(data?.username ?? ''));
    return slug ? `https://linkedin.com/in/${slug}` : normalizeUrl(String(data?.url ?? ''));
  },
  youtube: (data) => {
    const url = String(data?.url ?? '').trim();
    if (url) return normalizeUrl(url);
    const handle = stripAt(String(data?.username ?? ''));
    return handle ? `https://youtube.com/@${handle}` : '';
  },
  spotify: (data) => {
    const url = String(data?.url ?? '').trim();
    if (url) return normalizeUrl(url);
    const uri = String(data?.uri ?? '').trim();
    if (uri.startsWith('spotify:'))
      return `https://open.spotify.com/${uri.replace('spotify:', '').replace(':', '/')}`;
    return '';
  },
  zoom: (data) => {
    const id = String(data?.meetingId ?? '').replace(/\s/g, '');
    if (!id) return '';
    const pwd = data?.password ? `?pwd=${encodeURIComponent(String(data.password))}` : '';
    return `https://zoom.us/j/${id}${pwd}`;
  },
  google_meet: (data) => {
    const code = String(data?.meetingCode ?? '').replace(/\s/g, '').toLowerCase();
    return code ? `https://meet.google.com/${code}` : '';
  },
  crypto: (data) => {
    const type = String(data?.coin ?? 'btc').toLowerCase();
    const address = String(data?.address ?? '').trim();
    if (!address) return '';
    const amount = data?.amount ? `?amount=${encodeURIComponent(String(data.amount))}` : '';
    if (type === 'eth' || type === 'ethereum') return `ethereum:${address}${amount}`;
    return `bitcoin:${address}${amount}`;
  },
  google_review: (data) => {
    const url = String(data?.url ?? '').trim();
    if (url) return normalizeUrl(url);
    const placeId = String(data?.placeId ?? '').trim();
    return placeId
      ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`
      : '';
  },
  paypal: (data) => {
    const raw = String(data?.username ?? data?.url ?? '').trim();
    if (!raw) return '';
    const slug = raw.replace(/^https?:\/\/(www\.)?paypal\.me\//i, '').replace(/^@/, '').split('/')[0];
    return slug ? `https://paypal.me/${slug}` : normalizeUrl(raw);
  },
  upi: (data) => {
    const vpa = String(data?.vpa ?? data?.upiId ?? '').trim();
    if (!vpa) return '';
    const parts = [`pa=${encodeURIComponent(vpa)}`];
    if (String(data?.payeeName ?? '').trim())
      parts.push(`pn=${encodeURIComponent(String(data.payeeName).trim())}`);
    if (String(data?.amount ?? '').trim())
      parts.push(`am=${encodeURIComponent(String(data.amount).trim())}`);
    parts.push('cu=INR');
    return `upi://pay?${parts.join('&')}`;
  },
  signal: (data) => {
    const phone = String(data?.phone ?? '').replace(/\D/g, '');
    if (phone) return `https://signal.me/#p/+${phone}`;
    return normalizeUrl(String(data?.url ?? ''));
  },
  gs1: (data) =>
    buildGs1DigitalLink({
      gtin: String(data?.gtin ?? ''),
      domain: String(data?.domain ?? ''),
      lot: String(data?.lot ?? ''),
      serial: String(data?.serial ?? ''),
      expiry: String(data?.expiry ?? ''),
    }),
};

export const URL_FIELD_LABELS: Record<string, string> = {
  menu: 'Menu link (website or PDF)',
  pdf: 'PDF file link',
  file: 'Download link',
  app: 'App store link',
  social: 'Social profile link',
};

/** Categories served as downloadable/static payloads (not dynamic short links). */
export const STATIC_PAYLOAD_CATEGORIES = [
  'vcard',
  'wifi',
  'event',
  'email',
  'sms',
  'phone',
  'location',
  'crypto',
] as const;

export type StaticPayloadCategory = (typeof STATIC_PAYLOAD_CATEGORIES)[number];

export const ATTACHMENT_SCAN_META: Partial<Record<string, AttachmentScanMeta>> = {
  vcard: { contentType: 'text/vcard', fileName: 'contact.vcf' },
  wifi: { contentType: 'text/plain', fileName: 'wifi.txt' },
  event: { contentType: 'text/calendar', fileName: 'event.ics' },
};

export const SCHEME_SCAN_CATEGORIES = ['email', 'sms', 'phone', 'location', 'crypto'] as const;

export type SchemeScanCategory = (typeof SCHEME_SCAN_CATEGORIES)[number];

export function buildCategoryPayload(category: string, data: QrPayloadData): string {
  const builder = PAYLOAD_BUILDERS[category];
  if (builder) return builder(data);
  return String(data?.url ?? data?.text ?? '');
}

export function categoryUrlFieldLabel(category: string): string {
  return URL_FIELD_LABELS[category] ?? 'Website URL';
}

export function getAttachmentScanMeta(category: string): AttachmentScanMeta | null {
  return ATTACHMENT_SCAN_META[category] ?? null;
}

export function isSchemeScanCategory(category: string): category is SchemeScanCategory {
  return (SCHEME_SCAN_CATEGORIES as readonly string[]).includes(category);
}
