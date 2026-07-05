'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GeofenceRuleRow } from './geofence-rule-row';
import { MAX_GEOFENCE_RULES, type GeofenceData } from '@/lib/geofence-shared';

export function GeofenceRulesList({
  data,
  onUpdateRule,
  onRemoveRule,
  onAddRule,
}: {
  data: GeofenceData;
  onUpdateRule: (id: string, patch: Partial<GeofenceData['rules'][0]>) => void;
  onRemoveRule: (id: string) => void;
  onAddRule: () => void;
}) {
  return (
    <div className="space-y-4">
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
              onUpdate={(patch) => onUpdateRule(rule.id, patch)}
              onRemove={() => onRemoveRule(rule.id)}
            />
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddRule}
        disabled={data.rules.length >= MAX_GEOFENCE_RULES}
        className="gap-2"
      >
        <Plus className="h-4 w-4" /> Add location rule
      </Button>

      <p className="text-xs text-muted-foreground">
        Priority: city match → country match → &quot;All other countries&quot; rule → default QR link.
        Works with schedule routing (time rules apply first). Max {MAX_GEOFENCE_RULES} rules.
      </p>
    </div>
  );
}
