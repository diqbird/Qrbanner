import type { ScanRecord } from '@/lib/analytics-utils';

export type OptimizationInsightId =
  | 'noScans'
  | 'mobileHeavy'
  | 'repeatScans'
  | 'peakHour'
  | 'geoDiverse'
  | 'menuTip';

export interface OptimizationInsight {
  id: OptimizationInsightId;
  severity: 'info' | 'warning' | 'success';
  params?: Record<string, string | number>;
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
      id: 'noScans',
      severity: 'info',
    });
    return insights;
  }

  const mobile = scans.filter((s) => s.device === 'Mobile').length;
  const mobilePct = Math.round((mobile / total) * 100);
  if (mobilePct > 70) {
    insights.push({
      id: 'mobileHeavy',
      severity: 'success',
      params: { mobilePct },
    });
  }

  const repeatRate = total > 0 && unique > 0 ? total / unique : 1;
  if (repeatRate > 2.5) {
    insights.push({
      id: 'repeatScans',
      severity: 'info',
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
      id: 'peakHour',
      severity: 'info',
      params: { hour: peakHour, hourEnd: peakHour + 1 },
    });
  }

  const countries = new Set(scans.map((s) => s.country).filter(Boolean));
  if (countries.size > 3) {
    insights.push({
      id: 'geoDiverse',
      severity: 'warning',
    });
  }

  if (opts?.category === 'menu' || opts?.category === 'restaurant') {
    insights.push({
      id: 'menuTip',
      severity: 'info',
    });
  }

  return insights.slice(0, 5);
}
