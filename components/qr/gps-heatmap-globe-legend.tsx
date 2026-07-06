'use client';

import { useLanguage } from '@/components/i18n/language-provider';

export function GpsHeatmapGlobeLegend() {
  const { t } = useLanguage();

  return (
    <div className="pointer-events-none absolute bottom-2 left-2 flex gap-3 text-[10px] text-slate-300">
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-red-500" /> {t('analytics.heatmap.legendGps')}
      </span>
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-blue-500" /> {t('analytics.heatmap.legendIp')}
      </span>
    </div>
  );
}
