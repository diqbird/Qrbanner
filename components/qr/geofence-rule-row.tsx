'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { COUNTRY_OPTIONS, type GeofenceData } from '@/lib/geofence-shared';
import { resolveGeofenceCountryName } from '@/lib/i18n/resolve-geofence-country-name';

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
  const { t, locale } = useLanguage();

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {t('qrFeatures.geofenceRule', { n: index + 1 })}
        </span>
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
          <Label className="text-xs">{t('qrFeatures.geofenceCountry')}</Label>
          <select
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            value={rule.countryCode}
            onChange={(e) => onUpdate({ countryCode: e.target.value })}
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {resolveGeofenceCountryName(c.code, locale)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">{t('qrFeatures.geofenceCity')}</Label>
          <Input
            placeholder={t('qrFeatures.geofenceCityPlaceholder')}
            value={rule.city}
            onChange={(e) => onUpdate({ city: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">{t('qrFeatures.geofenceLabel')}</Label>
        <Input
          placeholder={t('qrFeatures.geofenceLabelPlaceholder')}
          value={rule.label ?? ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">{t('qrFeatures.geofenceRedirect')}</Label>
        <Input
          placeholder={t('qrFeatures.geofenceRedirectPlaceholder')}
          value={rule.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
        />
      </div>
    </div>
  );
}
