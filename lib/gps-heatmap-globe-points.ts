import type { HeatmapPoint } from '@/lib/gps-heatmap';

export interface GlobePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  count: number;
  source: 'gps' | 'ip';
}

export function buildGlobePoints(
  points: HeatmapPoint[],
  formatTooltip: (point: HeatmapPoint) => string
): GlobePoint[] {
  const max = Math.max(...points.map((p) => p.count), 1);
  return points.slice(0, 200).map((p) => ({
    lat: p.lat,
    lng: p.lng,
    size: 0.08 + (p.count / max) * 0.55,
    color: p.source === 'gps' ? '#ef4444' : '#3b82f6',
    label: formatTooltip(p),
    count: p.count,
    source: p.source,
  }));
}
