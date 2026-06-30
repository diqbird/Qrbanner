'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, CalendarClock, Gauge, Smartphone, Sparkles, Link2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export interface AdvancedValues {
  password: string;
  expiresAt: string;
  scanLimit: string;
  iosUrl: string;
  androidUrl: string;
  utmEnabled: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

export function AdvancedSettings({
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
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Advanced Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Optional pro features. Leave blank to skip any of them.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Password protection */}
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

        {/* Expiry + scan limit */}
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

        {/* Smart routing */}
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

        {/* UTM tracking */}
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
      </CardContent>
    </Card>
  );
}

export const emptyAdvanced: AdvancedValues = {
  password: '',
  expiresAt: '',
  scanLimit: '',
  iosUrl: '',
  androidUrl: '',
  utmEnabled: false,
  utmSource: 'qrbanner',
  utmMedium: 'qr',
  utmCampaign: '',
};
