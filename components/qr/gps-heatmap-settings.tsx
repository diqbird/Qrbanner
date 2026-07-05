'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { MapPin } from 'lucide-react';

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
