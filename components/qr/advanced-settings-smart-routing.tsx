'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone } from 'lucide-react';
import type { AdvancedValues } from '@/lib/advanced-settings-types';

export function AdvancedSettingsSmartRouting({
  values,
  onChange,
}: {
  values: AdvancedValues;
  onChange: (v: AdvancedValues) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-dashed p-4">
      <div className="flex items-center gap-2">
        <Smartphone className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Smart routing (by device)</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Send iOS and Android users to different links automatically (e.g. App Store vs. Google Play). Everyone else uses the main link.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs">iOS link</Label>
          <Input
            placeholder="https://apps.apple.com/..."
            value={values.iosUrl}
            onChange={(e) => onChange({ ...values, iosUrl: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Android link</Label>
          <Input
            placeholder="https://play.google.com/..."
            value={values.androidUrl}
            onChange={(e) => onChange({ ...values, androidUrl: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
