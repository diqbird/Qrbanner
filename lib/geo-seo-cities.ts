export interface GeoCity {
  slug: string;
  name: string;
  nameTr: string;
  country: string;
  countryTr: string;
  countryCode: string;
}

export const GEO_CITIES: GeoCity[] = [
  { slug: 'istanbul', name: 'Istanbul', nameTr: 'İstanbul', country: 'Turkey', countryTr: 'Türkiye', countryCode: 'TR' },
  { slug: 'ankara', name: 'Ankara', nameTr: 'Ankara', country: 'Turkey', countryTr: 'Türkiye', countryCode: 'TR' },
  { slug: 'izmir', name: 'Izmir', nameTr: 'İzmir', country: 'Turkey', countryTr: 'Türkiye', countryCode: 'TR' },
  { slug: 'antalya', name: 'Antalya', nameTr: 'Antalya', country: 'Turkey', countryTr: 'Türkiye', countryCode: 'TR' },
  { slug: 'london', name: 'London', nameTr: 'Londra', country: 'United Kingdom', countryTr: 'Birleşik Krallık', countryCode: 'GB' },
  { slug: 'new-york', name: 'New York', nameTr: 'New York', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US' },
  { slug: 'los-angeles', name: 'Los Angeles', nameTr: 'Los Angeles', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US' },
  { slug: 'chicago', name: 'Chicago', nameTr: 'Chicago', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US' },
  { slug: 'dubai', name: 'Dubai', nameTr: 'Dubai', country: 'United Arab Emirates', countryTr: 'Birleşik Arap Emirlikleri', countryCode: 'AE' },
  { slug: 'riyadh', name: 'Riyadh', nameTr: 'Riyad', country: 'Saudi Arabia', countryTr: 'Suudi Arabistan', countryCode: 'SA' },
  { slug: 'berlin', name: 'Berlin', nameTr: 'Berlin', country: 'Germany', countryTr: 'Almanya', countryCode: 'DE' },
  { slug: 'munich', name: 'Munich', nameTr: 'Münih', country: 'Germany', countryTr: 'Almanya', countryCode: 'DE' },
  { slug: 'paris', name: 'Paris', nameTr: 'Paris', country: 'France', countryTr: 'Fransa', countryCode: 'FR' },
  { slug: 'amsterdam', name: 'Amsterdam', nameTr: 'Amsterdam', country: 'Netherlands', countryTr: 'Hollanda', countryCode: 'NL' },
  { slug: 'mumbai', name: 'Mumbai', nameTr: 'Mumbai', country: 'India', countryTr: 'Hindistan', countryCode: 'IN' },
  { slug: 'delhi', name: 'Delhi', nameTr: 'Delhi', country: 'India', countryTr: 'Hindistan', countryCode: 'IN' },
  { slug: 'singapore', name: 'Singapore', nameTr: 'Singapur', country: 'Singapore', countryTr: 'Singapur', countryCode: 'SG' },
  { slug: 'sydney', name: 'Sydney', nameTr: 'Sidney', country: 'Australia', countryTr: 'Avustralya', countryCode: 'AU' },
  { slug: 'toronto', name: 'Toronto', nameTr: 'Toronto', country: 'Canada', countryTr: 'Kanada', countryCode: 'CA' },
  { slug: 'madrid', name: 'Madrid', nameTr: 'Madrid', country: 'Spain', countryTr: 'İspanya', countryCode: 'ES' },
];

export function getGeoCityBySlug(slug: string): GeoCity | undefined {
  return GEO_CITIES.find((c) => c.slug === slug);
}
