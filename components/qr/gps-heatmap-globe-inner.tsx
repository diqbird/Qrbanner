'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { HeatmapPoint } from '@/lib/gps-heatmap';
import { buildGlobePoints } from '@/lib/gps-heatmap-globe-points';
import { useGpsHeatmapGlobeResize } from '@/hooks/use-gps-heatmap-globe-resize';
import { GpsHeatmapGlobeLegend } from './gps-heatmap-globe-legend';

const EARTH_TEXTURE = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg';
const BUMP_TEXTURE = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png';

export default function GpsHeatmapGlobeInner({ points }: { points: HeatmapPoint[] }) {
  const { t, locale } = useLanguage();
  const globeRef = useRef<any>(null);
  const { setContainerRef, width } = useGpsHeatmapGlobeResize();
  const height = 320;

  const formatTooltip = useCallback(
    (point: HeatmapPoint) => {
      const label = point.label ?? t('analytics.unknown');
      return point.count === 1
        ? t('analytics.heatmap.tooltipOne', { label })
        : t('analytics.heatmap.tooltipMany', {
            label,
            count: formatLocaleNumber(point.count, locale),
          });
    },
    [t, locale]
  );

  const globePoints = useMemo(() => buildGlobePoints(points, formatTooltip), [points, formatTooltip]);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls?.();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = true;
    }
    const top = points[0];
    if (top) {
      g.pointOfView({ lat: top.lat, lng: top.lng, altitude: 2.2 }, 800);
    }
  }, [points, width]);

  return (
    <div
      ref={setContainerRef}
      className="relative h-[320px] w-full overflow-hidden rounded-xl border border-border/50 bg-slate-950"
    >
      {width > 0 && (
        <Globe
          ref={globeRef}
          width={width}
          height={height}
          backgroundColor="rgba(2,6,23,1)"
          globeImageUrl={EARTH_TEXTURE}
          bumpImageUrl={BUMP_TEXTURE}
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.18}
          pointsData={globePoints}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude="size"
          pointRadius={0.35}
          pointLabel="label"
          pointsMerge={false}
          pointsTransitionDuration={600}
        />
      )}
      <GpsHeatmapGlobeLegend />
    </div>
  );
}
