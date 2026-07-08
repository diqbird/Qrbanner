import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';
import type { ScanRecord } from '@/lib/analytics-utils';
import { daysBetween } from '@/lib/analytics-utils';
import { buildHeatmapPoints } from '@/lib/gps-heatmap';

type GroupRow = { name: string; value: number };

function scanWhere(
  qrCodeIds: string[],
  from: Date | null,
  to: Date | null,
): Prisma.QRScanWhereInput {
  const where: Prisma.QRScanWhereInput = { qrCodeId: { in: qrCodeIds } };
  if (from || to) {
    where.scannedAt = {};
    if (from) where.scannedAt.gte = from;
    if (to) where.scannedAt.lte = to;
  }
  return where;
}

function mapGroupBy(rows: { _count: { _all: number }; [key: string]: unknown }[], field: string): GroupRow[] {
  return rows
    .map((r) => ({
      name: String(r[field] ?? 'Unknown') || 'Unknown',
      value: r._count._all,
    }))
    .filter((r) => r.name !== 'Unknown' && r.name !== 'null')
    .sort((a, b) => b.value - a.value);
}

async function countDistinctIps(where: Prisma.QRScanWhereInput, fallbackTotal: number): Promise<number> {
  const ips = await prisma.qRScan.findMany({
    where: {
      ...where,
      ip: { not: null },
      NOT: [{ ip: { startsWith: '192.168.' } }, { ip: { startsWith: '10.' } }],
    },
    distinct: ['ip'],
    select: { ip: true },
    take: 50000,
  });
  const valid = ips.filter((r) => r.ip && r.ip !== 'unknown');
  return valid.length || fallbackTotal;
}

function fillDailyChart(from: Date, to: Date, counts: Map<string, number>) {
  const dayCount = daysBetween(from, to);
  const result: { date: string; count: number }[] = [];
  for (let i = 0; i < dayCount; i++) {
    const d = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split('T')[0] ?? '';
    result.push({ date: key.slice(5), count: counts.get(key) ?? 0 });
  }
  return result;
}

async function scansByDaySql(
  qrCodeIds: string[],
  from: Date,
  to: Date,
): Promise<{ date: string; count: number }[]> {
  if (qrCodeIds.length === 0) return fillDailyChart(from, to, new Map());

  const rows = await prisma.$queryRaw<{ day: Date; count: bigint }[]>`
    SELECT DATE("scannedAt") AS day, COUNT(*)::bigint AS count
    FROM "QRScan"
    WHERE "qrCodeId" = ANY(${qrCodeIds}::text[])
      AND "scannedAt" >= ${from}
      AND "scannedAt" <= ${to}
    GROUP BY DATE("scannedAt")
    ORDER BY day ASC
  `;

  const counts = new Map(rows.map((r) => [r.day.toISOString().slice(0, 10), Number(r.count)]));
  return fillDailyChart(from, to, counts);
}

async function scansByHourSql(
  qrCodeIds: string[],
  from: Date | null,
  to: Date | null,
): Promise<{ name: string; hour: number; value: number }[]> {
  const hours = Array.from({ length: 24 }, (_, h) => ({
    name: `${h.toString().padStart(2, '0')}:00`,
    hour: h,
    value: 0,
  }));

  if (qrCodeIds.length === 0) return hours;

  const rows = await prisma.$queryRaw<{ hour: number; count: bigint }[]>`
    SELECT EXTRACT(HOUR FROM "scannedAt")::int AS hour, COUNT(*)::bigint AS count
    FROM "QRScan"
    WHERE "qrCodeId" = ANY(${qrCodeIds}::text[])
      AND (${from}::timestamptz IS NULL OR "scannedAt" >= ${from})
      AND (${to}::timestamptz IS NULL OR "scannedAt" <= ${to})
    GROUP BY hour
    ORDER BY hour ASC
  `;

  for (const row of rows) {
    const h = Number(row.hour);
    if (hours[h]) hours[h].value = Number(row.count);
  }
  return hours;
}

export async function fetchTopQrByPeriod(opts: {
  qrCodes: { id: string; name: string; isActive: boolean }[];
  range: { from: Date | null; to: Date | null };
  limit?: number;
}): Promise<{ id: string; name: string; totalScans: number; isActive: boolean }[]> {
  const { qrCodes, range, limit = 5 } = opts;
  if (qrCodes.length === 0) return [];

  const from = range.from ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to = range.to ?? new Date();
  const qrIds = qrCodes.map((q) => q.id);

  const rows = await prisma.qRScan.groupBy({
    by: ['qrCodeId'],
    where: scanWhere(qrIds, from, to),
    _count: { _all: true },
    orderBy: { _count: { qrCodeId: 'desc' } },
    take: limit,
  });

  const meta = Object.fromEntries(qrCodes.map((q) => [q.id, q]));
  return rows.map((row) => ({
    id: row.qrCodeId,
    name: meta[row.qrCodeId]?.name ?? 'Unknown',
    totalScans: row._count?._all ?? 0,
    isActive: meta[row.qrCodeId]?.isActive ?? true,
  }));
}

function peakFromDailyAndHourly(
  daily: { date: string; count: number }[],
  hourly: { name: string; hour: number; value: number }[],
  locale: 'en' | 'tr',
) {
  const localeTag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const peakHour = [...hourly].sort((a, b) => b.value - a.value)[0];
  const peakDay = daily.length
    ? daily.reduce((best, d) => (d.count > best.count ? d : best), daily[0])
    : null;
  const year = new Date().getFullYear();
  return {
    peakDay: peakDay?.count
      ? {
          name: new Date(`${year}-${peakDay.date}`).toLocaleDateString(localeTag, { weekday: 'long' }),
          count: peakDay.count,
        }
      : null,
    peakHour: peakHour?.value ? { name: peakHour.name, count: peakHour.value } : null,
  };
}

export async function fetchAggregatedAnalytics(opts: {
  qrCodeIds: string[];
  range: { from: Date | null; to: Date | null };
  nameMap?: Record<string, string>;
  locale?: 'en' | 'tr';
}) {
  const { qrCodeIds, range, nameMap = {}, locale = 'en' } = opts;
  const from = range.from ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to = range.to ?? new Date();
  const where = scanWhere(qrCodeIds, from, to);

  const emptyHourly = await scansByHourSql([], null, null);

  if (qrCodeIds.length === 0) {
    return {
      totalScans: 0,
      uniqueScans: 0,
      todayScans: 0,
      last7Days: 0,
      last30Days: 0,
      scansByDay: fillDailyChart(from, to, new Map()),
      scansByDevice: [],
      scansByBrowser: [],
      scansByOS: [],
      scansByHour: emptyHourly,
      peakInsights: { peakDay: null, peakHour: null },
      scansByCountry: [],
      scansByCity: [],
      scansBySource: [],
      scansByAbVariant: [],
      scansByUtmSource: [],
      scansByUtmMedium: [],
      scansByUtmCampaign: [],
      heatmapPoints: [],
      recentScans: [],
    };
  }

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalScans,
    byCountry,
    byCity,
    byDevice,
    byBrowser,
    byOs,
    bySource,
    byAb,
    byUtmSource,
    byUtmMedium,
    byUtmCampaign,
    recentRows,
    heatmapRows,
    scansByDay,
    scansByHour,
    todayScans,
    last7Days,
    last30Days,
  ] = await Promise.all([
    prisma.qRScan.count({ where }),
    prisma.qRScan.groupBy({ by: ['country'], where, _count: { _all: true } }),
    prisma.qRScan.groupBy({ by: ['city'], where, _count: { _all: true } }),
    prisma.qRScan.groupBy({ by: ['device'], where, _count: { _all: true } }),
    prisma.qRScan.groupBy({ by: ['browser'], where, _count: { _all: true } }),
    prisma.qRScan.groupBy({ by: ['os'], where, _count: { _all: true } }),
    prisma.qRScan.groupBy({ by: ['scanSource'], where, _count: { _all: true } }),
    prisma.qRScan.groupBy({ by: ['abVariantId'], where, _count: { _all: true } }),
    prisma.qRScan.groupBy({ by: ['utmSource'], where, _count: { _all: true } }),
    prisma.qRScan.groupBy({ by: ['utmMedium'], where, _count: { _all: true } }),
    prisma.qRScan.groupBy({ by: ['utmCampaign'], where, _count: { _all: true } }),
    prisma.qRScan.findMany({
      where,
      orderBy: { scannedAt: 'desc' },
      take: 20,
      select: {
        country: true,
        city: true,
        device: true,
        browser: true,
        os: true,
        scannedAt: true,
        qrCodeId: true,
      },
    }),
    prisma.qRScan.findMany({
      where,
      select: { latitude: true, longitude: true, country: true, city: true },
      take: 2500,
    }),
    scansByDaySql(qrCodeIds, from, to),
    scansByHourSql(qrCodeIds, from, to),
    prisma.qRScan.count({ where: scanWhere(qrCodeIds, todayStart, null) }),
    prisma.qRScan.count({ where: scanWhere(qrCodeIds, last7, null) }),
    prisma.qRScan.count({ where: scanWhere(qrCodeIds, last30, null) }),
  ]);

  const uniqueScans = await countDistinctIps(where, totalScans);
  const heatmapScans: ScanRecord[] = heatmapRows.map((r) => ({
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    city: r.city,
  }));

  return {
    totalScans,
    uniqueScans,
    todayScans,
    last7Days,
    last30Days,
    scansByDay,
    scansByDevice: mapGroupBy(byDevice, 'device'),
    scansByBrowser: mapGroupBy(byBrowser, 'browser'),
    scansByOS: mapGroupBy(byOs, 'os'),
    scansByHour,
    peakInsights: peakFromDailyAndHourly(scansByDay, scansByHour, locale),
    scansByCountry: mapGroupBy(byCountry, 'country'),
    scansByCity: mapGroupBy(byCity, 'city'),
    scansBySource: mapGroupBy(bySource, 'scanSource'),
    scansByAbVariant: mapGroupBy(byAb, 'abVariantId'),
    scansByUtmSource: mapGroupBy(byUtmSource, 'utmSource'),
    scansByUtmMedium: mapGroupBy(byUtmMedium, 'utmMedium'),
    scansByUtmCampaign: mapGroupBy(byUtmCampaign, 'utmCampaign'),
    heatmapPoints: buildHeatmapPoints(heatmapScans),
    recentScans: recentRows.map((s) => ({
      country: s.country ?? 'Unknown',
      city: s.city ?? null,
      device: s.device ?? 'Unknown',
      browser: s.browser ?? 'Unknown',
      os: s.os ?? 'Unknown',
      scannedAt: s.scannedAt,
      qrName: nameMap[s.qrCodeId] ?? null,
    })),
  };
}
