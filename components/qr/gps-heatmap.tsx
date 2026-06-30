'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { MapPin } from 'lucide-react';
import type { HeatmapPoint } from '@/lib/gps-heatmap';

export function GpsHeatmapSettings({
  enabled,
  onEnabledChange,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5 text-primary" /> GPS Heatmap
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
        <p className="text-sm text-muted-foreground">
          Ask visitors for browser location on scan (optional consent). IP-based approximations are used as fallback.
        </p>
      </CardHeader>
    </Card>
  );
}

export function GpsHeatmapChart({ points }: { points: HeatmapPoint[] }) {
  if (!points.length) return null;

  const max = Math.max(...points.map((p) => p.count), 1);
  const minLat = Math.min(...points.map((p) => p.lat));
  const maxLat = Math.max(...points.map((p) => p.lat));
  const minLng = Math.min(...points.map((p) => p.lng));
  const maxLng = Math.max(...points.map((p) => p.lng));
  const latSpan = maxLat - minLat || 1;
  const lngSpan = maxLng - minLng || 1;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> GPS Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[280px] w-full overflow-hidden rounded-xl border border-border/50 bg-gradient-to-b from-sky-50/80 to-emerald-50/40 dark:from-slate-900 dark:to-slate-800">
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
        <p className="mt-2 text-xs text-muted-foreground">
          {points.length} location clusters · darker/larger = more scans
        </p>
      </CardContent>
    </Card>
  );
}
