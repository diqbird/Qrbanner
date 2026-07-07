import type { buildAnalytics } from '@/lib/analytics-utils';
import type { Locale } from '@/lib/i18n/types';
import { analyticsPeriodVars } from '@/lib/i18n/analytics-period-vars';

export type AnalyticsPayload = Partial<ReturnType<typeof buildAnalytics>> & {
  totalScans: number;
  last7Days: number;
  scansByDay: { date: string; count: number }[];
  scansByCountry: { name: string; value: number }[];
};

export type AnalyticsCsvLabels = {
  summary: string;
  metric: string;
  value: string;
  totalScans: string;
  uniqueVisitors: string;
  today: string;
  last7Days: string;
  last30Days: string;
  scansByDay: string;
  countries: string;
  cities: string;
  devices: string;
  browsers: string;
  operatingSystems: string;
  recentScans: string;
  date: string;
  scans: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  os: string;
  qr: string;
  time: string;
};

export function buildAnalyticsCsvLabels(
  t: (key: string, vars?: Record<string, string | number>) => string,
  locale: Locale,
): AnalyticsCsvLabels {
  const periodVars = analyticsPeriodVars(locale);
  return {
    summary: t('analytics.csvExport.summary'),
    metric: t('analytics.csvExport.metric'),
    value: t('analytics.csvExport.value'),
    totalScans: t('analytics.totalScans'),
    uniqueVisitors: t('analytics.uniqueVisitors'),
    today: t('analytics.today'),
    last7Days: t('analytics.last7Days', { days: periodVars.days7 }),
    last30Days: t('analytics.last30Days', { days: periodVars.days30 }),
    scansByDay: t('analytics.csvExport.scansByDay'),
    countries: t('analytics.countries'),
    cities: t('analytics.cities'),
    devices: t('analytics.charts.devices'),
    browsers: t('analytics.charts.browsers'),
    operatingSystems: t('analytics.charts.operatingSystems'),
    recentScans: t('analytics.recentScans'),
    date: t('analytics.pdfDate'),
    scans: t('analytics.charts.scans'),
    country: t('analytics.pdfCountry'),
    city: t('analytics.csvExport.city'),
    device: t('analytics.pdfDevice'),
    browser: t('analytics.pdfBrowser'),
    os: t('analytics.csvExport.os'),
    qr: t('analytics.csvExport.qr'),
    time: t('analytics.pdfTime'),
  };
}

export function buildAnalyticsCsv(
  data: AnalyticsPayload,
  labels: AnalyticsCsvLabels,
  label = 'analytics',
): string {
  const lines: string[] = [`# ${label}`, ''];

  lines.push(labels.summary);
  lines.push(`${labels.metric},${labels.value}`);
  lines.push(`${labels.totalScans},${data.totalScans}`);
  lines.push(`${labels.uniqueVisitors},${data.uniqueScans ?? 0}`);
  lines.push(`${labels.today},${data.todayScans ?? 0}`);
  lines.push(`${labels.last7Days},${data.last7Days}`);
  lines.push(`${labels.last30Days},${data.last30Days ?? 0}`);
  lines.push('');

  const section = (title: string, rows: { name: string; value: number }[], keyA: string, keyB: string) => {
    if (!rows?.length) return;
    lines.push(title);
    lines.push(`${keyA},${keyB}`);
    rows.forEach((r) => lines.push(`"${r.name.replace(/"/g, '""')}",${r.value}`));
    lines.push('');
  };

  section(
    labels.scansByDay,
    data.scansByDay.map((d) => ({ name: d.date, value: d.count })),
    labels.date,
    labels.scans,
  );
  section(labels.countries, data.scansByCountry, labels.country, labels.scans);
  if (data.scansByCity?.length) section(labels.cities, data.scansByCity, labels.city, labels.scans);
  if (data.scansByDevice?.length) section(labels.devices, data.scansByDevice, labels.device, labels.scans);
  if (data.scansByBrowser?.length) section(labels.browsers, data.scansByBrowser, labels.browser, labels.scans);
  if (data.scansByOS?.length) section(labels.operatingSystems, data.scansByOS, labels.os, labels.scans);

  if (data.recentScans?.length) {
    lines.push(labels.recentScans);
    lines.push(
      [labels.time, labels.country, labels.city, labels.device, labels.browser, labels.os, labels.qr].join(','),
    );
    data.recentScans.forEach((s) => {
      const time = s.scannedAt ? new Date(s.scannedAt).toISOString() : '';
      lines.push(
        [
          time,
          s.country ?? '',
          s.city ?? '',
          s.device ?? '',
          s.browser ?? '',
          s.os ?? '',
          (s as { qrName?: string }).qrName ?? '',
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(','),
      );
    });
  }

  return lines.join('\n');
}

export function downloadAnalyticsCsv(
  data: AnalyticsPayload,
  filename: string,
  labels: AnalyticsCsvLabels,
) {
  const csv = buildAnalyticsCsv(data, labels, filename);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
