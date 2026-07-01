import { buildHeatmapPoints } from '@/lib/gps-heatmap';

export interface ScanRecord {
  ip?: string | null;
  country?: string | null;
  city?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  scannedAt?: Date | string | null;
  qrCodeId?: string;
  qrName?: string;
  scanSource?: string | null;
  abVariantId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface AnalyticsRange {
  from: Date | null;
  to: Date | null;
}

export function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000)) + 1);
}

export function groupByField(arr: ScanRecord[], key: keyof ScanRecord) {
  const map: Record<string, number> = {};
  (arr ?? []).forEach((item) => {
    const val = String(item?.[key] ?? 'Unknown') || 'Unknown';
    map[val] = (map[val] ?? 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function countUniqueScans(scans: ScanRecord[]): number {
  const ips = new Set<string>();
  scans.forEach((s) => {
    const ip = s?.ip;
    if (ip && ip !== 'unknown' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
      ips.add(ip);
    }
  });
  return ips.size || scans.length;
}

export function buildScansByDay(scans: ScanRecord[], days = 30) {
  const now = new Date();
  const dayMap: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split('T')[0] ?? '';
    dayMap[key] = 0;
  }
  scans.forEach((s) => {
    const key = new Date(s?.scannedAt ?? now).toISOString().split('T')[0] ?? '';
    if (dayMap[key] !== undefined) dayMap[key]++;
  });
  return Object.entries(dayMap).map(([date, count]) => ({
    date: date.slice(5),
    count,
  }));
}

export function buildScansByDayForRange(scans: ScanRecord[], range: AnalyticsRange) {
  const from = range.from ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to = range.to ?? new Date();
  const days = daysBetween(from, to);
  const dayMap: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split('T')[0] ?? '';
    dayMap[key] = 0;
  }
  scans.forEach((s) => {
    const key = new Date(s?.scannedAt ?? 0).toISOString().split('T')[0] ?? '';
    if (dayMap[key] !== undefined) dayMap[key]++;
  });
  return Object.entries(dayMap).map(([date, count]) => ({
    date: date.slice(5),
    count,
  }));
}

export function scansSince(scans: ScanRecord[], since: Date): number {
  return scans.filter((s) => new Date(s?.scannedAt ?? 0) >= since).length;
}

export function scansToday(scans: ScanRecord[]): number {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  return scansSince(scans, start);
}

export function buildScansByHour(scans: ScanRecord[]) {
  const hours = Array.from({ length: 24 }, (_, h) => ({
    name: `${h.toString().padStart(2, '0')}:00`,
    hour: h,
    value: 0,
  }));
  scans.forEach((s) => {
    const h = new Date(s?.scannedAt ?? 0).getHours();
    if (hours[h]) hours[h].value++;
  });
  return hours;
}

export function findPeakDayHour(scans: ScanRecord[], locale: 'en' | 'tr' = 'en') {
  const localeTag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const dayMap: Record<string, number> = {};
  const hourMap: Record<number, number> = {};
  scans.forEach((s) => {
    const d = new Date(s?.scannedAt ?? 0);
    const dayKey = d.toLocaleDateString(localeTag, { weekday: 'long' });
    dayMap[dayKey] = (dayMap[dayKey] ?? 0) + 1;
    const h = d.getHours();
    hourMap[h] = (hourMap[h] ?? 0) + 1;
  });
  const peakDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0];
  const peakHour = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0];
  return {
    peakDay: peakDay ? { name: peakDay[0], count: peakDay[1] } : null,
    peakHour: peakHour ? { name: `${peakHour[0].padStart(2, '0')}:00`, count: peakHour[1] } : null,
  };
}

export function buildAnalytics(
  scans: ScanRecord[],
  days = 30,
  range?: AnalyticsRange,
  locale: 'en' | 'tr' = 'en',
) {
  const now = new Date();
  const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    totalScans: scans.length,
    uniqueScans: countUniqueScans(scans),
    todayScans: scansToday(scans),
    last7Days: scansSince(scans, last7),
    last30Days: scansSince(scans, last30),
    scansByDay: range
      ? buildScansByDayForRange(scans, range)
      : buildScansByDay(scans, days),
    scansByDevice: groupByField(scans, 'device'),
    scansByBrowser: groupByField(scans, 'browser'),
    scansByOS: groupByField(scans, 'os'),
    scansByHour: buildScansByHour(scans),
    peakInsights: findPeakDayHour(scans, locale),
    scansByCountry: groupByField(scans, 'country'),
    scansByCity: groupByField(scans, 'city'),
    scansBySource: groupByField(scans, 'scanSource'),
    scansByAbVariant: groupByField(scans, 'abVariantId'),
    heatmapPoints: buildHeatmapPoints(scans),
    recentScans: scans.slice(0, 20).map((s) => ({
      country: s?.country ?? 'Unknown',
      city: s?.city ?? null,
      device: s?.device ?? 'Unknown',
      browser: s?.browser ?? 'Unknown',
      os: s?.os ?? 'Unknown',
      scannedAt: s?.scannedAt,
      qrName: s?.qrName ?? null,
    })),
  };
}
