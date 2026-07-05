'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Clock } from 'lucide-react';
import {
  ScheduleData,
  emptyScheduleData,
} from '@/lib/schedule-utils';
import { ScheduleSettingsHours } from './schedule-settings-hours';
import { ScheduleSettingsDailyUrls } from './schedule-settings-daily-urls';

export function ScheduleSettings({
  enabled,
  onEnabledChange,
  data,
  onChange,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  data: ScheduleData;
  onChange: (v: ScheduleData) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-primary" />
            Time-Based Routing
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
        <p className="text-sm text-muted-foreground">
          Redirect to different URLs by time of day or day of week — perfect for menus & business hours.
        </p>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-5">
          <ScheduleSettingsHours data={data} onChange={onChange} />
          <ScheduleSettingsDailyUrls data={data} onChange={onChange} />
        </CardContent>
      )}
    </Card>
  );
}

export { emptyScheduleData };
export type { ScheduleData };
