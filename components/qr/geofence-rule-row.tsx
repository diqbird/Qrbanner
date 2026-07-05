'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { COUNTRY_OPTIONS, type GeofenceData } from '@/lib/geofence-shared';

export function GeofenceRuleRow({
  rule,
  index,
  onUpdate,
  onRemove,
}: {
  rule: GeofenceData['rules'][0];
  index: number;
  onUpdate: (patch: Partial<GeofenceData['rules'][0]>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Rule {index + 1}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-8 w-8 p-0 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs">Country</Label>
          <select
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            value={rule.countryCode}
            onChange={(e) => onUpdate({ countryCode: e.target.value })}
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">City (optional)</Label>
          <Input
            placeholder="e.g. Istanbul"
            value={rule.city}
            onChange={(e) => onUpdate({ city: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Label (optional)</Label>
        <Input
          placeholder="e.g. Turkey store"
          value={rule.label ?? ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Redirect URL</Label>
        <Input
          placeholder="https://example.com/tr"
          value={rule.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
        />
      </div>
    </div>
  );
}
