'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { SCAN_MILESTONES } from '@/lib/scan-notify-constants';

export interface ScanNotifyValues {
  enabled: boolean;
  firstScan: boolean;
  milestones: boolean;
  everyScan: boolean;
}

export const emptyScanNotify: ScanNotifyValues = {
  enabled: false,
  firstScan: true,
  milestones: true,
  everyScan: false,
};

export function ScanNotifySettings({
  values,
  onChange,
  emailConfigured,
}: {
  values: ScanNotifyValues;
  onChange: (v: ScanNotifyValues) => void;
  emailConfigured?: boolean;
}) {
  const { t } = useLanguage();
  const set = (patch: Partial<ScanNotifyValues>) => onChange({ ...values, ...patch });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display flex items-center gap-2 text-base">
            <Bell className="h-5 w-5 text-primary" />
            {t('scanNotify.title')}
          </CardTitle>
          <Switch
            checked={values.enabled}
            onCheckedChange={(v) => set({ enabled: v })}
          />
        </div>
        <p className="text-sm text-muted-foreground">{t('scanNotify.subtitle')}</p>
        {emailConfigured === false && (
          <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-1">
            <Mail className="h-3.5 w-3.5" />
            {t('scanNotify.smtpUnavailable')}
          </p>
        )}
      </CardHeader>
      {values.enabled && (
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
            <div>
              <Label className="text-sm">{t('scanNotify.firstScanLabel')}</Label>
              <p className="text-xs text-muted-foreground">{t('scanNotify.firstScanDesc')}</p>
            </div>
            <Switch checked={values.firstScan} onCheckedChange={(v) => set({ firstScan: v })} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
            <div>
              <Label className="text-sm">{t('scanNotify.milestonesLabel')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('scanNotify.milestonesDesc', { counts: SCAN_MILESTONES.join(', ') })}
              </p>
            </div>
            <Switch checked={values.milestones} onCheckedChange={(v) => set({ milestones: v })} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 p-3">
            <div>
              <Label className="text-sm">{t('scanNotify.everyScanLabel')}</Label>
              <p className="text-xs text-muted-foreground">{t('scanNotify.everyScanDesc')}</p>
            </div>
            <Switch
              checked={values.everyScan}
              onCheckedChange={(v) =>
                set({
                  everyScan: v,
                  firstScan: v ? false : values.firstScan,
                  milestones: v ? false : values.milestones,
                })
              }
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
