import type { AnalyticsRange } from '@/lib/analytics-utils';
import { getUserPlanUsage } from '@/lib/plan-usage';

export function getAnalyticsCutoffDate(planRetentionDays: number | null): Date | null {
  if (planRetentionDays == null) return null;
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - planRetentionDays);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function getUserAnalyticsCutoff(userId: string): Promise<Date | null> {
  const usage = await getUserPlanUsage(userId);
  return getAnalyticsCutoffDate(usage.plan.analyticsRetentionDays);
}

export function parseAnalyticsRange(
  searchParams: URLSearchParams,
  cutoff: Date | null
): AnalyticsRange {
  const fromRaw = searchParams.get('from');
  const toRaw = searchParams.get('to');
  let from: Date | null = fromRaw ? new Date(fromRaw) : null;
  let to: Date | null = toRaw ? new Date(toRaw) : null;

  if (from && isNaN(from.getTime())) from = null;
  if (to && isNaN(to.getTime())) to = null;
  if (to) {
    to.setUTCHours(23, 59, 59, 999);
  }

  if (cutoff) {
    if (!from || from < cutoff) from = cutoff;
  }

  if (!from && !to) {
    const d = new Date();
    from = new Date(d.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (cutoff && from < cutoff) from = cutoff;
  }

  return { from, to };
}

/** Same-length range immediately before `range` (for period-over-period comparison). */
export function getPreviousPeriodRange(range: AnalyticsRange): AnalyticsRange | null {
  if (!range.from || !range.to) return null;

  const from = new Date(range.from);
  const to = new Date(range.to);
  from.setUTCHours(0, 0, 0, 0);

  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / dayMs) + 1);

  const prevTo = new Date(from.getTime() - 1);
  prevTo.setUTCHours(23, 59, 59, 999);

  const prevFrom = new Date(prevTo.getTime() - (days - 1) * dayMs);
  prevFrom.setUTCHours(0, 0, 0, 0);

  return { from: prevFrom, to: prevTo };
}

export function earliestAnalyticsFetchDate(
  range: AnalyticsRange,
  cutoff: Date | null,
): Date | null {
  const prev = getPreviousPeriodRange(range);
  let earliest = range.from ?? prev?.from ?? cutoff;
  if (prev?.from && (!earliest || prev.from < earliest)) earliest = prev.from;
  if (cutoff && earliest && earliest < cutoff) earliest = cutoff;
  return earliest;
}

export function filterScansByRange<T extends { scannedAt?: Date | string | null }>(
  scans: T[],
  range: AnalyticsRange
): T[] {
  return scans.filter((s) => {
    const t = new Date(s.scannedAt ?? 0).getTime();
    if (range.from && t < range.from.getTime()) return false;
    if (range.to && t > range.to.getTime()) return false;
    return true;
  });
}
