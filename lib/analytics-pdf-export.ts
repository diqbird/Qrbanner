import type { AnalyticsPayload } from '@/lib/analytics-export';
import { formatLocaleDateTime, formatLocaleNumber } from '@/lib/i18n/format-locale';
import { interpolate } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/types';

export type AnalyticsPdfLabels = {
  reportTitle: string;
  generatedAt: string;
  period: string;
  summary: string;
  totalScans: string;
  uniqueVisitors: string;
  today: string;
  last7Days: string;
  last30Days: string;
  countries: string;
  cities: string;
  devices: string;
  browsers: string;
  operatingSystems: string;
  scansByDay: string;
  recentScans: string;
  name: string;
  value: string;
  date: string;
  country: string;
  device: string;
  browser: string;
  time: string;
  footer: string;
  moreRows: string;
  emptyValue: string;
};

export type AnalyticsPdfOptions = {
  filename: string;
  subtitle?: string;
  periodLabel?: string;
  labels: AnalyticsPdfLabels;
  locale: Locale;
};

const MARGIN = 14;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

function ensureSpace(doc: import('jspdf').jsPDF, y: number, need: number): number {
  if (y + need > 285) {
    doc.addPage();
    return MARGIN + 4;
  }
  return y;
}

function sectionTitle(doc: import('jspdf').jsPDF, title: string, y: number): number {
  y = ensureSpace(doc, y, 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(title, MARGIN, y);
  doc.setFont('helvetica', 'normal');
  return y + 6;
}

function kvRow(
  doc: import('jspdf').jsPDF,
  label: string,
  value: string | number,
  y: number,
  locale: Locale,
): number {
  y = ensureSpace(doc, y, 6);
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(label, MARGIN, y);
  doc.setTextColor(20, 20, 20);
  doc.text(typeof value === 'number' ? formatLocaleNumber(value, locale) : String(value), MARGIN + 62, y);
  return y + 5;
}

function twoColumnTable(
  doc: import('jspdf').jsPDF,
  rows: { name: string; value: number }[],
  headers: [string, string],
  y: number,
  locale: Locale,
  maxRows = 12,
  moreRowsLabel?: string,
): number {
  if (!rows.length) return y;
  y = ensureSpace(doc, y, 10);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text(headers[0], MARGIN, y);
  doc.text(headers[1], MARGIN + CONTENT_W - 18, y, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  y += 4;

  rows.slice(0, maxRows).forEach((row) => {
    y = ensureSpace(doc, y, 5);
    const name = row.name.length > 42 ? `${row.name.slice(0, 39)}…` : row.name;
    doc.setTextColor(50, 50, 50);
    doc.text(name, MARGIN, y);
    doc.text(String(formatLocaleNumber(row.value, locale)), MARGIN + CONTENT_W - 18, y, { align: 'right' });
    y += 4.5;
  });

  if (rows.length > maxRows) {
    y = ensureSpace(doc, y, 5);
    doc.setTextColor(120, 120, 120);
    doc.text(
      interpolate(moreRowsLabel ?? '+{{count}}', {
        count: formatLocaleNumber(rows.length - maxRows, locale),
      }),
      MARGIN,
      y,
    );
    y += 4;
  }

  return y + 3;
}

/** Download a printable analytics summary PDF (client-side). */
export async function downloadAnalyticsPdf(data: AnalyticsPayload, options: AnalyticsPdfOptions) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const { labels, subtitle, periodLabel, locale } = options;
  let y = MARGIN;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.text(labels.reportTitle, MARGIN, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  if (subtitle) {
    doc.text(subtitle, MARGIN, y);
    y += 4;
  }
  if (periodLabel) {
    doc.text(`${labels.period}: ${periodLabel}`, MARGIN, y);
    y += 4;
  }
  doc.text(`${labels.generatedAt}: ${formatLocaleDateTime(new Date(), locale)}`, MARGIN, y);
  y += 8;

  y = sectionTitle(doc, labels.summary, y);
  y = kvRow(doc, labels.totalScans, data.totalScans, y, locale);
  y = kvRow(doc, labels.uniqueVisitors, data.uniqueScans ?? 0, y, locale);
  y = kvRow(doc, labels.today, data.todayScans ?? 0, y, locale);
  y = kvRow(doc, labels.last7Days, data.last7Days, y, locale);
  y = kvRow(doc, labels.last30Days, data.last30Days ?? 0, y, locale);
  y += 2;

  y = sectionTitle(doc, labels.scansByDay, y);
  y = twoColumnTable(
    doc,
    data.scansByDay.map((d) => ({ name: d.date, value: d.count })),
    [labels.date, labels.value],
    y,
    locale,
    14,
    labels.moreRows,
  );

  y = sectionTitle(doc, labels.countries, y);
  y = twoColumnTable(doc, data.scansByCountry, [labels.country, labels.value], y, locale, 12, labels.moreRows);

  if (data.scansByCity?.length) {
    y = sectionTitle(doc, labels.cities, y);
    y = twoColumnTable(doc, data.scansByCity, [labels.name, labels.value], y, locale, 12, labels.moreRows);
  }

  if (data.scansByDevice?.length) {
    y = sectionTitle(doc, labels.devices, y);
    y = twoColumnTable(doc, data.scansByDevice, [labels.device, labels.value], y, locale, 12, labels.moreRows);
  }

  if (data.scansByBrowser?.length) {
    y = sectionTitle(doc, labels.browsers, y);
    y = twoColumnTable(doc, data.scansByBrowser, [labels.browser, labels.value], y, locale, 12, labels.moreRows);
  }

  if (data.scansByOS?.length) {
    y = sectionTitle(doc, labels.operatingSystems, y);
    y = twoColumnTable(doc, data.scansByOS, [labels.name, labels.value], y, locale, 12, labels.moreRows);
  }

  if (data.recentScans?.length) {
    y = sectionTitle(doc, labels.recentScans, y);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    y = ensureSpace(doc, y, 8);
    doc.text(labels.time, MARGIN, y);
    doc.text(labels.country, MARGIN + 42, y);
    doc.text(labels.device, MARGIN + 88, y);
    doc.setFont('helvetica', 'normal');
    y += 4;

    data.recentScans.slice(0, 25).forEach((scan) => {
      y = ensureSpace(doc, y, 5);
      const time = scan.scannedAt ? new Date(scan.scannedAt).toISOString().slice(0, 16).replace('T', ' ') : '';
      const country = [scan.country, scan.city].filter(Boolean).join(', ') || labels.emptyValue;
      const device = [scan.device, scan.browser].filter(Boolean).join(' · ') || labels.emptyValue;
      doc.setTextColor(50, 50, 50);
      doc.text(time, MARGIN, y);
      doc.text(country.length > 22 ? `${country.slice(0, 19)}…` : country, MARGIN + 42, y);
      doc.text(device.length > 28 ? `${device.slice(0, 25)}…` : device, MARGIN + 88, y);
      y += 4.5;
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text(labels.footer, MARGIN, 292);
    doc.text(`${i} / ${pageCount}`, PAGE_W - MARGIN, 292, { align: 'right' });
  }

  doc.save(`${options.filename}.pdf`);
}

export function buildAnalyticsPdfLabels(
  t: (key: string, vars?: Record<string, string | number>) => string,
): AnalyticsPdfLabels {
  return {
    reportTitle: t('analytics.pdfReportTitle'),
    generatedAt: t('analytics.pdfGeneratedAt'),
    period: t('analytics.pdfPeriod'),
    summary: t('analytics.pdfSummary'),
    totalScans: t('analytics.totalScans'),
    uniqueVisitors: t('analytics.uniqueVisitors'),
    today: t('analytics.today'),
    last7Days: t('analytics.last7Days'),
    last30Days: t('analytics.last30Days'),
    countries: t('analytics.countries'),
    cities: t('analytics.cities'),
    devices: t('analytics.pdfDevices'),
    browsers: t('analytics.pdfBrowsers'),
    operatingSystems: t('analytics.pdfOperatingSystems'),
    scansByDay: t('analytics.scanActivity'),
    recentScans: t('analytics.recentScans'),
    name: t('common.name'),
    value: t('analytics.pdfValue'),
    date: t('analytics.pdfDate'),
    country: t('analytics.pdfCountry'),
    device: t('analytics.pdfDevice'),
    browser: t('analytics.pdfBrowser'),
    time: t('analytics.pdfTime'),
    footer: t('analytics.pdfFooter'),
    moreRows: t('analytics.pdfMoreRows'),
    emptyValue: t('common.emptyValue'),
  };
}
