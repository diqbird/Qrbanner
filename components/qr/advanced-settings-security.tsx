'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, CalendarClock, Gauge, Smartphone } from 'lucide-react';
import type { AdvancedValues } from '@/lib/advanced-settings-types';

export function AdvancedSettingsSecurity({
  category,
  values,
  onChange,
  hasExistingPassword,
}: {
  category: string;
  values: AdvancedValues;
  onChange: (v: AdvancedValues) => void;
  hasExistingPassword?: boolean;
}) {
  const set = (patch: Partial<AdvancedValues>) => onChange({ ...values, ...patch });
  const showSmartRouting = ['url', 'menu', 'social', 'app'].includes(category);

  return (
    <>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" /> Password protection
        </Label>
        <Input
          type="password"
          autoComplete="new-password"
          placeholder={hasExistingPassword ? 'Password set — type to change, clear to remove' : 'Set a password (optional)'}
          value={values.password}
          onChange={(e) => set({ password: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Scanners must enter this password before being redirected.
          {hasExistingPassword ? ' A password is currently set.' : ''}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground" /> Expiration date
          </Label>
          <Input
            type="datetime-local"
            value={values.expiresAt}
            onChange={(e) => set({ expiresAt: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" /> Scan limit
          </Label>
          <Input
            type="number"
            min={1}
            placeholder="e.g., 1000"
            value={values.scanLimit}
            onChange={(e) => set({ scanLimit: e.target.value })}
          />
        </div>
      </div>

      {showSmartRouting && (
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
                onChange={(e) => set({ iosUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Android link</Label>
              <Input
                placeholder="https://play.google.com/..."
                value={values.androidUrl}
                onChange={(e) => set({ androidUrl: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
