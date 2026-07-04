/**
 * Offline IP geolocation via geoip-lite (no external API calls).
 */
import path from 'path';

export interface GeoLocation {
  country: string | null;
  countryCode: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
}

let geoip: typeof import('geoip-lite') | null = null;

/** geoip-lite resolves data relative to __dirname; bundled Next.js builds need an explicit path. */
function ensureGeoDataDir() {
  if (process.env.GEODATADIR) return;
  try {
    const pkgJson = require.resolve('geoip-lite/package.json');
    process.env.GEODATADIR = path.join(path.dirname(pkgJson), 'data');
  } catch {
    process.env.GEODATADIR = path.join(process.cwd(), 'node_modules', 'geoip-lite', 'data');
  }
}

function loadGeoip() {
  if (!geoip) {
    try {
      ensureGeoDataDir();
      geoip = require('geoip-lite');
    } catch {
      geoip = null;
    }
  }
  return geoip;
}

const COUNTRY_NAMES: Record<string, string> = {
  TR: 'Turkey', US: 'United States', GB: 'United Kingdom', DE: 'Germany',
  FR: 'France', IT: 'Italy', ES: 'Spain', NL: 'Netherlands', BE: 'Belgium',
  AT: 'Austria', CH: 'Switzerland', PL: 'Poland', RU: 'Russia', UA: 'Ukraine',
  SA: 'Saudi Arabia', AE: 'UAE', IN: 'India', CN: 'China', JP: 'Japan',
  KR: 'South Korea', AU: 'Australia', CA: 'Canada', BR: 'Brazil', MX: 'Mexico',
  EG: 'Egypt', GR: 'Greece', PT: 'Portugal', SE: 'Sweden', NO: 'Norway',
  DK: 'Denmark', FI: 'Finland', IE: 'Ireland', CZ: 'Czech Republic',
  RO: 'Romania', HU: 'Hungary', BG: 'Bulgaria', AZ: 'Azerbaijan',
  KZ: 'Kazakhstan', UZ: 'Uzbekistan', IQ: 'Iraq', IR: 'Iran', IL: 'Israel',
  PK: 'Pakistan', ID: 'Indonesia', MY: 'Malaysia', SG: 'Singapore',
  TH: 'Thailand', VN: 'Vietnam', PH: 'Philippines', AR: 'Argentina',
  CL: 'Chile', CO: 'Colombia', ZA: 'South Africa', NG: 'Nigeria',
};

export function countryName(code: string | null | undefined): string {
  if (!code) return 'Unknown';
  const upper = code.toUpperCase();
  return COUNTRY_NAMES[upper] ?? upper;
}

export function lookupGeo(ip: string | null | undefined): GeoLocation {
  const empty: GeoLocation = {
    country: null, countryCode: null, city: null, latitude: null, longitude: null,
  };
  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return empty;
  }

  const lib = loadGeoip();
  if (!lib) return empty;

  const result = lib.lookup(ip);
  if (!result) return empty;

  const code = result.country ?? null;
  const ll = result.ll as [number, number] | undefined;
  return {
    country: code ? countryName(code) : null,
    countryCode: code,
    city: result.city ?? null,
    latitude: ll?.[0] ?? null,
    longitude: ll?.[1] ?? null,
  };
}
