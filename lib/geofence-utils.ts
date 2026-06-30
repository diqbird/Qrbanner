import { lookupGeo } from '@/lib/geoip';
import {
  normalizeCountry,
  parseGeofenceData,
  cityMatches,
} from '@/lib/geofence-shared';

export type { GeofenceRule, GeofenceData } from '@/lib/geofence-shared';
export {
  emptyGeofenceData,
  sanitizeGeofenceData,
  parseGeofenceData,
} from '@/lib/geofence-shared';

export interface ScanGeoContext {
  countryCode: string | null;
  city: string | null;
  country: string | null;
}

/** Returns matched URL or null to keep current redirect */
export function resolveGeofenceUrl(
  geofenceData: unknown,
  countryCode: string | null,
  city: string | null
): string | null {
  const data = parseGeofenceData(geofenceData);
  if (!data.rules.length) return null;

  const code = normalizeCountry(countryCode);
  const withCity = data.rules.filter(
    (r) => r.countryCode === code && r.city && cityMatches(r.city, city)
  );
  if (withCity.length) return withCity[0].url;

  const countryOnly = data.rules.filter((r) => r.countryCode === code && !r.city?.trim());
  if (countryOnly.length) return countryOnly[0].url;

  const wildcard = data.rules.filter((r) => r.countryCode === '*');
  if (wildcard.length) return wildcard[0].url;

  return null;
}

export function getScanGeoFromRequest(req: {
  headers: { get(name: string): string | null };
}): ScanGeoContext {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null;
  const headerCountry =
    req.headers.get('cf-ipcountry') ??
    req.headers.get('x-vercel-ip-country') ??
    null;
  const geo = lookupGeo(ip);

  return {
    countryCode: geo.countryCode ?? (headerCountry ? normalizeCountry(headerCountry) : null),
    city: geo.city,
    country: geo.country,
  };
}
