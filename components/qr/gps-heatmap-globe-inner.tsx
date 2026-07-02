'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import type { HeatmapPoint } from '@/lib/gps-heatmap';

const EARTH_TEXTURE = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg';
const BUMP_TEXTURE = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png';

interface GlobePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  count: number;
  source: 'gps' | 'ip';
}

export default function GpsHeatmapGlobeInner({ points }: { points: HeatmapPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [width, setWidth] = useState(0);
  const height = 320;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const max = useMemo(() => Math.max(...points.map((p) => p.count), 1), [points]);

  const globePoints = useMemo<GlobePoint[]>(
    () =>
      points.slice(0, 200).map((p) => ({
        lat: p.lat,
        lng: p.lng,
        size: 0.08 + (p.count / max) * 0.55,
        color: p.source === 'gps' ? '#ef4444' : '#3b82f6',
        label: `${p.label ?? 'Unknown'} · ${p.count} scan${p.count > 1 ? 's' : ''}`,
        count: p.count,
        source: p.source,
      })),
    [points, max]
  );

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
      ref={containerRef}
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
      <div className="pointer-events-none absolute bottom-2 left-2 flex gap-3 text-[10px] text-slate-300">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" /> GPS
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-500" /> IP approx.
        </span>
      </div>
    </div>
  );
}
