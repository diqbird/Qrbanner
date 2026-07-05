'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { parseReferralSettings, type ReferralSettingsData } from '@/lib/referral-settings-utils';
import { ReferralSettingsLinkPanel } from './referral-settings-link-panel';

export function ReferralSettings() {
  const { t } = useLanguage();
  const { data, loading } = useSettingsResource({ url: '/api/referral', parse: parseReferralSettings });
  const [view, setView] = useState<ReferralSettingsData | null>(null);

  useEffect(() => {
    if (data) setView(data);
  }, [data]);

  if (loading || !view) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          {t('referral.title')}
        </CardTitle>
        <CardDescription>{t('referral.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReferralSettingsLinkPanel view={view} />
      </CardContent>
    </Card>
  );
}
