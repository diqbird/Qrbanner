'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, CalendarDays } from 'lucide-react';
import {
  ScheduleData,
  emptyScheduleData,
  TIMEZONE_OPTIONS,
  DAY_LABELS,
} from '@/lib/schedule-utils';

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
  const set = (patch: Partial<ScheduleData>) => onChange({ ...data, ...patch });

  const toggleDay = (day: number) => {
    const days = data.days.includes(day)
      ? data.days.filter((d) => d !== day)
      : [...data.days, day].sort();
    set({ days });
  };

  const setDayUrl = (day: number, url: string) => {
    set({ dayUrls: { ...data.dayUrls, [String(day)]: url } });
  };

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
          <div className="space-y-2">
            <Label>Timezone</Label>
            <select
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={data.timezone}
              onChange={(e) => set({ timezone: e.target.value })}
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Open time</Label>
              <Input type="time" value={data.openTime} onChange={(e) => set({ openTime: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Close time</Label>
              <Input type="time" value={data.closeTime} onChange={(e) => set({ closeTime: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Active days</Label>
            <div className="flex flex-wrap gap-2">
              {DAY_LABELS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    data.days.includes(d.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>URL during open hours</Label>
              <Input
                placeholder="https://menu.example.com/lunch"
                value={data.openUrl}
                onChange={(e) => set({ openUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>URL outside hours</Label>
              <Input
                placeholder="https://menu.example.com/closed"
                value={data.closedUrl}
                onChange={(e) => set({ closedUrl: e.target.value })}
              />
            </div>
          </div>

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
        </CardContent>
      )}
    </Card>
  );
}

export { emptyScheduleData };
export type { ScheduleData };
