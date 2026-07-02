'use client';

import dynamic from 'next/dynamic';
import type { HeatmapPoint } from '@/lib/gps-heatmap';

const GpsHeatmapGlobeInner = dynamic(() => import('./gps-heatmap-globe-inner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] w-full items-center justify-center rounded-xl border border-border/50 bg-slate-950 text-xs text-slate-400">
      Loading globe…
    </div>
  ),
});

export function GpsHeatmapGlobe({ points }: { points: HeatmapPoint[] }) {
  return <GpsHeatmapGlobeInner points={points} />;
}
