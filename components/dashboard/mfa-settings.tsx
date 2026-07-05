'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { SettingsCardSkeleton } from '@/components/dashboard/settings-card-skeleton';
import { useMfaSettings } from '@/hooks/use-mfa-settings';
import { MfaDisablePanel, MfaSetupConfirmPanel, MfaStartSetupPanel } from './mfa-settings-panels';

export function MfaSettings() {
  const mfa = useMfaSettings();
  const { t, loading, enabled, setup } = mfa;

  if (loading) return <SettingsCardSkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> {t('settings.mfa.title')}
        </CardTitle>
        <CardDescription>{t('settings.mfa.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enabled ? (
          <MfaDisablePanel mfa={mfa} />
        ) : setup ? (
          <MfaSetupConfirmPanel mfa={mfa} />
        ) : (
          <MfaStartSetupPanel mfa={mfa} />
        )}
      </CardContent>
    </Card>
  );
}
