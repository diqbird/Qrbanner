'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { AdvancedValues } from '@/lib/advanced-settings-types';

export function AdvancedSettingsUtm({
  values,
  onChange,
}: {
  values: AdvancedValues;
  onChange: (v: AdvancedValues) => void;
}) {
  const set = (patch: Partial<AdvancedValues>) => onChange({ ...values, ...patch });

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">UTM campaign tracking</span>
        </div>
        <Switch checked={values.utmEnabled} onCheckedChange={(v) => set({ utmEnabled: v })} />
      </div>
      <p className="text-xs text-muted-foreground">
        Automatically append UTM parameters to redirect URLs for Google Analytics.
      </p>
      {values.utmEnabled && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label className="text-xs">Source</Label>
            <Input placeholder="qrbanner" value={values.utmSource} onChange={(e) => set({ utmSource: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Medium</Label>
            <Input placeholder="qr" value={values.utmMedium} onChange={(e) => set({ utmMedium: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Campaign</Label>
            <Input placeholder="summer-menu" value={values.utmCampaign} onChange={(e) => set({ utmCampaign: e.target.value })} />
          </div>
        </div>
      )}
    </div>
  );
}
