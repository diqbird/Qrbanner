import type { ScanRecord } from '@/lib/analytics-utils';

export interface OptimizationInsight {
  id: string;
  severity: 'info' | 'warning' | 'success';
  title: string;
  body: string;
}

export function buildOptimizationInsights(
  scans: ScanRecord[],
  opts?: { totalScans?: number; uniqueScans?: number; category?: string }
): OptimizationInsight[] {
  const insights: OptimizationInsight[] = [];
  const total = scans.length;
  const unique = opts?.uniqueScans ?? total;

  if (total === 0) {
    insights.push({
      id: 'no-scans',
      severity: 'info',
      title: 'No scans yet',
      body: 'Share your QR on packaging, social bio, or print materials. Add a “Scan Me” frame for better visibility.',
    });
    return insights;
  }

  const mobile = scans.filter((s) => s.device === 'Mobile').length;
  const mobilePct = Math.round((mobile / total) * 100);
  if (mobilePct > 70) {
    insights.push({
      id: 'mobile-heavy',
      severity: 'success',
      title: `${mobilePct}% mobile scans`,
      body: 'Most users scan from phones — optimize landing pages for mobile and keep redirect URLs fast.',
    });
  }

  const repeatRate = total > 0 && unique > 0 ? total / unique : 1;
  if (repeatRate > 2.5) {
    insights.push({
      id: 'repeat-scans',
      severity: 'info',
      title: 'High repeat scan rate',
      body: 'Many users scan more than once — great for menus or WiFi. Consider a static QR if the link never changes.',
    });
  }

  const hours = new Array(24).fill(0);
  scans.forEach((s) => {
    const h = new Date(s.scannedAt ?? 0).getHours();
    hours[h]++;
  });
  const peakHour = hours.indexOf(Math.max(...hours));
  if (Math.max(...hours) > 0) {
    insights.push({
      id: 'peak-hour',
      severity: 'info',
      title: `Peak hour: ${peakHour}:00–${peakHour + 1}:00`,
      body: 'Schedule campaigns or staff availability around your busiest scan window.',
    });
  }

  const countries = new Set(scans.map((s) => s.country).filter(Boolean));
  if (countries.size > 3) {
    insights.push({
      id: 'geo-diverse',
      severity: 'warning',
      title: 'International audience',
      body: 'Enable geofencing or localized landing pages for top countries.',
    });
  }

  if (opts?.category === 'menu' || opts?.category === 'restaurant') {
    insights.push({
      id: 'menu-tip',
      severity: 'info',
      title: 'Restaurant best practice',
      body: 'Use time-based routing for lunch vs dinner menus and NFC tags on table tents.',
    });
  }

  return insights.slice(0, 5);
}
