'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { DAY_LABELS, type ScheduleData } from '@/lib/schedule-utils';

type ScheduleSettingsDailyUrlsProps = {
  data: ScheduleData;
  onChange: (v: ScheduleData) => void;
};

export function ScheduleSettingsDailyUrls({ data, onChange }: ScheduleSettingsDailyUrlsProps) {
  const { t } = useLanguage();

  const setDayUrl = (day: number, url: string) => {
    onChange({ ...data, dayUrls: { ...data.dayUrls, [String(day)]: url } });
  };

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{t('qrFeatures.scheduleDailyTitle')}</span>
      </div>
      <p className="text-xs text-muted-foreground">{t('qrFeatures.scheduleDailyDesc')}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {DAY_LABELS.map((d) => {
          const label = t(`qrFeatures.day${d.value}` as 'qrFeatures.day0');
          return (
            <div key={d.value} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <Input
                placeholder={t('qrFeatures.scheduleDayUrl', { day: label })}
                value={data.dayUrls[String(d.value)] || ''}
                onChange={(e) => setDayUrl(d.value, e.target.value)}
                className="text-xs"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
