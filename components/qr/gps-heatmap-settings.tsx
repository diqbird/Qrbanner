'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

export function GpsHeatmapSettings({
  enabled,
  onEnabledChange,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
}) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5 text-primary" /> {t('qrFeatures.gpsTitle')}
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
        <p className="text-sm text-muted-foreground">{t('qrFeatures.gpsSubtitle')}</p>
      </CardHeader>
    </Card>
  );
}
