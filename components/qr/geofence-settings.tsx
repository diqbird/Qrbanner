'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';
import { GeofenceRuleRow } from './geofence-rule-row';
import {
  GeofenceData,
  emptyGeofenceData,
  MAX_GEOFENCE_RULES,
} from '@/lib/geofence-shared';

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
  const addRule = () => {
    if (data.rules.length >= MAX_GEOFENCE_RULES) return;
    onChange({
      rules: [
        ...data.rules,
        {
          id: `rule-${Date.now()}`,
          countryCode: 'TR',
          city: '',
          url: '',
          label: '',
        },
      ],
    });
  };

  const updateRule = (id: string, patch: Partial<GeofenceData['rules'][0]>) => {
    onChange({
      rules: data.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });
  };

  const removeRule = (id: string) => {
    onChange({ rules: data.rules.filter((r) => r.id !== id) });
  };

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
        <CardContent className="space-y-4">
          {data.rules.length === 0 ? (
            <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-4 text-center">
              No location rules yet. Add a rule for each region you want to target.
            </p>
          ) : (
            <div className="space-y-3">
              {data.rules.map((rule, index) => (
                <GeofenceRuleRow
                  key={rule.id}
                  rule={rule}
                  index={index}
                  onUpdate={(patch) => updateRule(rule.id, patch)}
                  onRemove={() => removeRule(rule.id)}
                />
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRule}
            disabled={data.rules.length >= MAX_GEOFENCE_RULES}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add location rule
          </Button>

          <p className="text-xs text-muted-foreground">
            Priority: city match → country match → &quot;All other countries&quot; rule → default QR link.
            Works with schedule routing (time rules apply first). Max {MAX_GEOFENCE_RULES} rules.
          </p>
        </CardContent>
      )}
    </Card>
  );
}

export { emptyGeofenceData };
export type { GeofenceData };
