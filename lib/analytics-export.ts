import type { buildAnalytics } from '@/lib/analytics-utils';

type AnalyticsPayload = Partial<ReturnType<typeof buildAnalytics>> & {
  totalScans: number;
  last7Days: number;
  scansByDay: { date: string; count: number }[];
  scansByCountry: { name: string; value: number }[];
};

export function buildAnalyticsCsv(data: AnalyticsPayload, label = 'analytics'): string {
  const lines: string[] = [`# ${label}`, ''];

  lines.push('Summary');
  lines.push('Metric,Value');
  lines.push(`Total scans,${data.totalScans}`);
  lines.push(`Unique visitors,${data.uniqueScans ?? 0}`);
  lines.push(`Today,${data.todayScans ?? 0}`);
  lines.push(`Last 7 days,${data.last7Days}`);
  lines.push(`Last 30 days,${data.last30Days ?? 0}`);
  lines.push('');

  const section = (title: string, rows: { name: string; value: number }[], keyA: string, keyB: string) => {
    if (!rows?.length) return;
    lines.push(title);
    lines.push(`${keyA},${keyB}`);
    rows.forEach((r) => lines.push(`"${r.name.replace(/"/g, '""')}",${r.value}`));
    lines.push('');
  };

  section('Scans by day', data.scansByDay.map((d) => ({ name: d.date, value: d.count })), 'Date', 'Scans');
  section('Countries', data.scansByCountry, 'Country', 'Scans');
  if (data.scansByCity?.length) section('Cities', data.scansByCity, 'City', 'Scans');
  if (data.scansByDevice?.length) section('Devices', data.scansByDevice, 'Device', 'Scans');
  if (data.scansByBrowser?.length) section('Browsers', data.scansByBrowser, 'Browser', 'Scans');
  if (data.scansByOS?.length) section('Operating systems', data.scansByOS, 'OS', 'Scans');

  if (data.recentScans?.length) {
    lines.push('Recent scans');
    lines.push('Time,Country,City,Device,Browser,OS,QR');
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
          .join(',')
      );
    });
  }

  return lines.join('\n');
}

export function downloadAnalyticsCsv(data: AnalyticsPayload, filename: string) {
  const csv = buildAnalyticsCsv(data, filename);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
