export interface GeofenceRule {
  id: string;
  countryCode: string;
  city: string;
  url: string;
  label?: string;
}

export interface GeofenceData {
  rules: GeofenceRule[];
}

export const emptyGeofenceData: GeofenceData = {
  rules: [],
};

export const MAX_GEOFENCE_RULES = 20;

export const COUNTRY_OPTIONS: { code: string; name: string }[] = [
  { code: 'TR', name: 'Turkey' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'PL', name: 'Poland' },
  { code: 'RU', name: 'Russia' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'UAE' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'EG', name: 'Egypt' },
  { code: 'GR', name: 'Greece' },
  { code: 'PT', name: 'Portugal' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'RO', name: 'Romania' },
  { code: 'HU', name: 'Hungary' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'IL', name: 'Israel' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'PH', name: 'Philippines' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: '*', name: 'All other countries' },
];

export function normalizeCity(city: string | null | undefined): string {
  return (city ?? '').trim().toLowerCase();
}

export function normalizeCountry(code: string | null | undefined): string {
  const c = (code ?? '').trim().toUpperCase();
  return c === '*' ? '*' : c.slice(0, 2);
}

export function parseGeofenceData(raw: unknown): GeofenceData {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { rules: [] };
  }
  const data = raw as { rules?: unknown };
  if (!Array.isArray(data.rules)) return { rules: [] };

  const rules: GeofenceRule[] = [];
  for (const item of data.rules) {
    if (!item || typeof item !== 'object') continue;
    const r = item as Partial<GeofenceRule>;
    const url = (r.url ?? '').trim();
    const countryCode = normalizeCountry(r.countryCode);
    if (!url || !countryCode) continue;
    rules.push({
      id: r.id || `rule-${rules.length}`,
      countryCode,
      city: (r.city ?? '').trim(),
      url,
      label: r.label?.trim() || undefined,
    });
    if (rules.length >= MAX_GEOFENCE_RULES) break;
  }
  return { rules };
}

export function sanitizeGeofenceData(data: GeofenceData): GeofenceData {
  return parseGeofenceData(data);
}

export function cityMatches(ruleCity: string, scanCity: string | null): boolean {
  if (!ruleCity) return true;
  const a = normalizeCity(ruleCity);
  const b = normalizeCity(scanCity);
  if (!a || !b) return false;
  return a === b || b.includes(a) || a.includes(b);
}
