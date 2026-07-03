/**
 * GS1 Digital Link builder.
 *
 * Encodes a product's GTIN (and optional batch/lot, serial, expiry) into a
 * GS1 Digital Link URI — the standard behind EU Digital Product Passports
 * and next-gen retail QR codes. Example output:
 *   https://id.example.com/01/09506000134352/10/LOT42/21/SER7?17=261231
 *
 * Application Identifiers used:
 *   01  GTIN (Global Trade Item Number, 14 digits canonical)
 *   10  Batch / lot number
 *   21  Serial number
 *   17  Expiry date (YYMMDD)
 */

const DEFAULT_RESOLVER = 'https://id.gs1.org';

/** Validate a GTIN-8/12/13/14 using the standard mod-10 check digit. */
export function isValidGtin(raw: string): boolean {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (![8, 12, 13, 14].includes(digits.length)) return false;

  const nums = digits.split('').map(Number);
  const check = nums.pop() as number;
  // Weight alternates 3,1 starting from the rightmost data digit.
  let sum = 0;
  for (let i = nums.length - 1, w = 3; i >= 0; i--, w = w === 3 ? 1 : 3) {
    sum += nums[i] * w;
  }
  const expected = (10 - (sum % 10)) % 10;
  return expected === check;
}

/** Pad a valid GTIN to the 14-digit canonical form GS1 Digital Link expects. */
export function toGtin14(raw: string): string {
  const digits = (raw ?? '').replace(/\D/g, '');
  return digits.padStart(14, '0');
}

function normalizeResolver(domain: string): string {
  const trimmed = (domain ?? '').trim();
  if (!trimmed) return DEFAULT_RESOLVER;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withScheme.replace(/\/+$/, '');
}

/** Convert an ISO date (YYYY-MM-DD) to the GS1 YYMMDD format. */
function toYyMmDd(iso: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((iso ?? '').trim());
  if (!m) return null;
  return `${m[1].slice(2)}${m[2]}${m[3]}`;
}

export interface Gs1LinkInput {
  gtin: string;
  domain?: string;
  lot?: string;
  serial?: string;
  expiry?: string;
}

/**
 * Build a GS1 Digital Link URI. Returns an empty string when the GTIN is
 * missing or fails check-digit validation, so callers can treat it like the
 * other QR payload builders.
 */
export function buildGs1DigitalLink({ gtin, domain, lot, serial, expiry }: Gs1LinkInput): string {
  if (!isValidGtin(gtin)) return '';

  const base = normalizeResolver(domain ?? '');
  let path = `${base}/01/${toGtin14(gtin)}`;

  if (lot && lot.trim()) {
    path += `/10/${encodeURIComponent(lot.trim())}`;
  }
  if (serial && serial.trim()) {
    path += `/21/${encodeURIComponent(serial.trim())}`;
  }

  const query: string[] = [];
  if (expiry && expiry.trim()) {
    const yymmdd = toYyMmDd(expiry);
    if (yymmdd) query.push(`17=${yymmdd}`);
  }

  return query.length ? `${path}?${query.join('&')}` : path;
}
