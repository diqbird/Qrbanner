'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/i18n/language-provider';
import { TIMEZONE_OPTIONS, DAY_LABELS, type ScheduleData } from '@/lib/schedule-utils';

type ScheduleSettingsHoursProps = {
  data: ScheduleData;
  onChange: (v: ScheduleData) => void;
};

export function ScheduleSettingsHours({ data, onChange }: ScheduleSettingsHoursProps) {
  const { t } = useLanguage();
  const set = (patch: Partial<ScheduleData>) => onChange({ ...data, ...patch });

  const toggleDay = (day: number) => {
    const days = data.days.includes(day)
      ? data.days.filter((d) => d !== day)
      : [...data.days, day].sort();
    set({ days });
  };

  const dayLabel = (value: number) => t(`qrFeatures.day${value}` as 'qrFeatures.day0');

  return (
    <>
      <div className="space-y-2">
        <Label>{t('qrFeatures.scheduleTimezone')}</Label>
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
          <Label>{t('qrFeatures.scheduleOpenTime')}</Label>
          <Input type="time" value={data.openTime} onChange={(e) => set({ openTime: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>{t('qrFeatures.scheduleCloseTime')}</Label>
          <Input type="time" value={data.closeTime} onChange={(e) => set({ closeTime: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('qrFeatures.scheduleActiveDays')}</Label>
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
              {dayLabel(d.value)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('qrFeatures.scheduleUrlOpen')}</Label>
          <Input
            placeholder="https://menu.example.com/lunch"
            value={data.openUrl}
            onChange={(e) => set({ openUrl: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('qrFeatures.scheduleUrlClosed')}</Label>
          <Input
            placeholder="https://menu.example.com/closed"
            value={data.closedUrl}
            onChange={(e) => set({ closedUrl: e.target.value })}
          />
        </div>
      </div>
    </>
  );
}
