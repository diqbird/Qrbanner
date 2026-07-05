'use client';

import type { HeatmapPoint } from '@/lib/gps-heatmap';

export function GpsHeatmapFlatMap({ points }: { points: HeatmapPoint[] }) {
  const max = Math.max(...points.map((p) => p.count), 1);
  const minLat = Math.min(...points.map((p) => p.lat));
  const maxLat = Math.max(...points.map((p) => p.lat));
  const minLng = Math.min(...points.map((p) => p.lng));
  const maxLng = Math.max(...points.map((p) => p.lng));
  const latSpan = maxLat - minLat || 1;
  const lngSpan = maxLng - minLng || 1;

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-xl border border-border/50 bg-gradient-to-b from-sky-50/80 to-emerald-50/40 dark:from-slate-900 dark:to-slate-800">
      <svg viewBox="0 0 100 60" className="h-full w-full" preserveAspectRatio="none">
        {points.slice(0, 80).map((p, i) => {
          const x = ((p.lng - minLng) / lngSpan) * 96 + 2;
          const y = 58 - ((p.lat - minLat) / latSpan) * 56;
          const r = 1.5 + (p.count / max) * 6;
          const opacity = 0.25 + (p.count / max) * 0.65;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={p.source === 'gps' ? '#ef4444' : '#3b82f6'}
              fillOpacity={opacity}
            />
          );
        })}
      </svg>
      <div className="absolute bottom-2 left-2 flex gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500/70" /> GPS</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500/70" /> IP approx.</span>
      </div>
    </div>
  );
}
