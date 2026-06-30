import { parse } from 'csv-parse/sync';
import { QR_CATEGORIES, buildQRPayload } from '@/lib/qr-utils';

const VALID_CATEGORIES = new Set(QR_CATEGORIES.map((c) => c.id));
/** Absolute ceiling — per-plan limits enforced in API/UI */
export const BULK_ABSOLUTE_MAX_ROWS = 2000;

export const BULK_CSV_TEMPLATE = `name,category,url,phone,email,ssid,wifi_password,qr_password,expires_at,scan_limit
Store Istanbul,url,https://example.com/istanbul,,,,,,,
Store Ankara,url,https://example.com/ankara,,,,,,,
Reception WiFi,wifi,,,,"GuestNetwork","welcome123",,,
`;

export interface BulkParsedRow {
  line: number;
  name: string;
  category: string;
  qrData: Record<string, string>;
  password?: string;
  expiresAt?: string;
  scanLimit?: number;
}

export interface BulkParseError {
  line: number;
  message: string;
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, '_');
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function buildQrDataFromRecord(category: string, record: Record<string, string>): Record<string, string> {
  switch (category) {
    case 'url':
    case 'menu':
    case 'social':
    case 'app':
      return { url: normalizeUrl(record.url ?? '') };
    case 'phone':
      return { phone: (record.phone ?? '').trim() };
    case 'sms':
      return {
        phone: (record.phone ?? '').trim(),
        message: record.message ?? record.body ?? '',
      };
    case 'email':
      return {
        email: (record.email ?? '').trim(),
        subject: record.subject ?? '',
        body: record.body ?? record.message ?? '',
      };
    case 'wifi':
      return {
        ssid: record.ssid ?? '',
        password: record.wifi_password ?? record.wifi_pass ?? record.password_wifi ?? '',
        encryption: record.encryption ?? 'WPA',
        hidden: record.hidden ?? 'false',
      };
    case 'vcard':
      return {
        firstName: record.first_name ?? record.firstname ?? '',
        lastName: record.last_name ?? record.lastname ?? '',
        phone: record.phone ?? '',
        email: record.email ?? '',
        org: record.org ?? record.organization ?? '',
        website: record.website ?? record.url ?? '',
      };
    default:
      return { url: normalizeUrl(record.url ?? '') };
  }
}

function validateRowContent(category: string, qrData: Record<string, string>): string | null {
  switch (category) {
    case 'url':
    case 'menu':
    case 'social':
    case 'app': {
      const url = qrData.url ?? '';
      if (!url) return 'URL is required for this category';
      if (!isValidUrl(url)) return 'Invalid URL';
      return null;
    }
    case 'phone':
      if (!qrData.phone?.trim()) return 'Phone number is required';
      return null;
    case 'sms':
      if (!qrData.phone?.trim()) return 'Phone number is required for SMS';
      return null;
    case 'email':
      if (!qrData.email?.trim()) return 'Email is required';
      return null;
    case 'wifi':
      if (!qrData.ssid?.trim()) return 'WiFi SSID is required';
      return null;
    case 'vcard':
      if (!qrData.firstName?.trim() && !qrData.lastName?.trim() && !qrData.phone?.trim()) {
        return 'vCard needs at least a name or phone';
      }
      return null;
    default:
      return null;
  }
}

export function parseBulkCSV(
  text: string,
  maxRows: number = BULK_ABSOLUTE_MAX_ROWS
): { rows: BulkParsedRow[]; errors: BulkParseError[] } {
  const rows: BulkParsedRow[] = [];
  const errors: BulkParseError[] = [];

  let records: Record<string, string>[];
  try {
    records = parse(text, {
      columns: (header: string[]) => header.map(normalizeHeader),
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as Record<string, string>[];
  } catch (e: any) {
    errors.push({ line: 1, message: e?.message ?? 'Invalid CSV format' });
    return { rows, errors };
  }

  if (records.length === 0) {
    errors.push({ line: 1, message: 'CSV file is empty' });
    return { rows, errors };
  }

  if (records.length > maxRows) {
    errors.push({ line: 1, message: `Maximum ${maxRows} rows per import on your plan` });
    return { rows, errors };
  }

  records.forEach((raw, index) => {
    const line = index + 2; // header is line 1
    const name = (raw.name ?? '').trim();

    if (!name) {
      errors.push({ line, message: 'Name is required' });
      return;
    }
    if (name.length > 200) {
      errors.push({ line, message: 'Name must be 200 characters or less' });
      return;
    }

    const categoryRaw = (raw.category ?? 'url').trim().toLowerCase();
    const category = categoryRaw || 'url';
    if (!VALID_CATEGORIES.has(category as any)) {
      errors.push({ line, message: `Unknown category "${categoryRaw}"` });
      return;
    }

    const qrData = buildQrDataFromRecord(category, raw);
    const contentError = validateRowContent(category, qrData);
    if (contentError) {
      errors.push({ line, message: contentError });
      return;
    }

    // Row-level password (QR access) — distinct from wifi_password
    const accessPassword =
      raw.qr_password ??
      raw.access_password ??
      (category !== 'wifi' ? raw.password : '') ??
      '';
    let expiresAt: string | undefined;
    if (raw.expires_at?.trim()) {
      const d = new Date(raw.expires_at.trim());
      if (Number.isNaN(d.getTime())) {
        errors.push({ line, message: 'Invalid expires_at date (use YYYY-MM-DD)' });
        return;
      }
      expiresAt = d.toISOString();
    }

    let scanLimit: number | undefined;
    if (raw.scan_limit?.trim()) {
      const n = parseInt(raw.scan_limit.trim(), 10);
      if (Number.isNaN(n) || n < 1) {
        errors.push({ line, message: 'scan_limit must be a positive number' });
        return;
      }
      scanLimit = n;
    }

    // Verify payload builds
    const payload = buildQRPayload(category, qrData);
    if (!payload?.trim()) {
      errors.push({ line, message: 'Could not build QR content from row data' });
      return;
    }

    rows.push({
      line,
      name,
      category,
      qrData,
      password: accessPassword || undefined,
      expiresAt,
      scanLimit,
    });
  });

  return { rows, errors };
}
