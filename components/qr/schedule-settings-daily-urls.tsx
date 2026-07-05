'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays } from 'lucide-react';
import { DAY_LABELS, type ScheduleData } from '@/lib/schedule-utils';

type ScheduleSettingsDailyUrlsProps = {
  data: ScheduleData;
  onChange: (v: ScheduleData) => void;
};

export function ScheduleSettingsDailyUrls({ data, onChange }: ScheduleSettingsDailyUrlsProps) {
  const setDayUrl = (day: number, url: string) => {
    onChange({ ...data, dayUrls: { ...data.dayUrls, [String(day)]: url } });
  };

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Daily menu URLs (optional)</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Override with a specific link per day — e.g. Monday menu, weekend brunch.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {DAY_LABELS.map((d) => (
          <div key={d.value} className="space-y-1">
            <Label className="text-xs">{d.label}</Label>
            <Input
              placeholder={`${d.label} URL`}
              value={data.dayUrls[String(d.value)] || ''}
              onChange={(e) => setDayUrl(d.value, e.target.value)}
              className="text-xs"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
