'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { MapPin } from 'lucide-react';
import { GeofenceRulesList } from './geofence-rules-list';
import { useGeofenceRuleActions } from '@/hooks/use-geofence-rule-actions';
import { emptyGeofenceData, type GeofenceData } from '@/lib/geofence-shared';

export function GeofenceSettings({
  enabled,
  onEnabledChange,
  data,
  onChange,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  data: GeofenceData;
  onChange: (v: GeofenceData) => void;
}) {
  const { addRule, updateRule, removeRule } = useGeofenceRuleActions(data, onChange);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5 text-primary" />
            Location-Based Links
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
        <p className="text-sm text-muted-foreground">
          Show different pages to visitors based on their country or city.
        </p>
      </CardHeader>
      {enabled && (
        <CardContent>
          <GeofenceRulesList
            data={data}
            onUpdateRule={updateRule}
            onRemoveRule={removeRule}
            onAddRule={addRule}
          />
        </CardContent>
      )}
    </Card>
  );
}

export { emptyGeofenceData };
export type { GeofenceData };
