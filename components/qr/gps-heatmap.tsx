'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { HeatmapPoint } from '@/lib/gps-heatmap';
import { GpsHeatmapGlobe } from './gps-heatmap-globe';
import { GpsHeatmapFlatMap } from './gps-heatmap-flat-map';
import { useWebglSupported } from '@/hooks/use-webgl-supported';

export function GpsHeatmapChart({ points }: { points: HeatmapPoint[] }) {
  const { t } = useLanguage();
  const webgl = useWebglSupported();
  if (!points.length) return null;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> {t('analytics.heatmap.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {webgl ? <GpsHeatmapGlobe points={points} /> : <GpsHeatmapFlatMap points={points} />}
        <p className="mt-2 text-xs text-muted-foreground">
          {t('analytics.heatmap.hint', { count: String(points.length) })}
        </p>
      </CardContent>
    </Card>
  );
}

export { GpsHeatmapSettings } from './gps-heatmap-settings';
