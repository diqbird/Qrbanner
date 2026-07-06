'use client';

import dynamic from 'next/dynamic';
import { useLanguage } from '@/components/i18n/language-provider';
import type { HeatmapPoint } from '@/lib/gps-heatmap';

function GpsHeatmapGlobeLoading() {
  const { t } = useLanguage();
  return (
    <div className="flex h-[320px] w-full items-center justify-center rounded-xl border border-border/50 bg-slate-950 text-xs text-slate-400">
      {t('analytics.heatmap.loadingGlobe')}
    </div>
  );
}

const GpsHeatmapGlobeInner = dynamic(() => import('./gps-heatmap-globe-inner'), {
  ssr: false,
  loading: () => <GpsHeatmapGlobeLoading />,
});

export function GpsHeatmapGlobe({ points }: { points: HeatmapPoint[] }) {
  return <GpsHeatmapGlobeInner points={points} />;
}
