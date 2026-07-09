'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { SettingsCardSkeleton } from '@/components/dashboard/settings-card-skeleton';
import { useEnterpriseWorkspace } from '@/hooks/use-enterprise-workspace';
import { EnterpriseSmtpPanel } from './enterprise-smtp-panel';
import { EnterpriseScimPanel } from './enterprise-scim-panel';
import { EnterpriseResellerPanel } from './enterprise-reseller-panel';
import { EnterpriseSupportCard } from './enterprise-support-card';

export function EnterpriseWorkspaceSettings() {
  const enterprise = useEnterpriseWorkspace();
  const { t, loading, state } = enterprise;

  if (loading) return <SettingsCardSkeleton />;
  if (!state || state.workspace.isPersonal) return null;

  const { features } = state;
  const tier = state.workspace.supportTier || 'standard';
  const showSupport = tier === 'priority' || tier === 'enterprise';

  return (
    <>
      {showSupport ? <EnterpriseSupportCard enterprise={enterprise} /> : null}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> {t('enterpriseWorkspace.title')}
          </CardTitle>
          <CardDescription>{t('enterpriseWorkspace.desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {!features.enterprise && (
            <p className="text-sm text-muted-foreground rounded-lg border border-border/50 p-3">
              {t('enterpriseWorkspace.upgradeHint')}
            </p>
          )}

          {features.enterprise && (
            <>
              <EnterpriseSmtpPanel enterprise={enterprise} />
              <EnterpriseScimPanel enterprise={enterprise} />
            </>
          )}

          {features.reseller && <EnterpriseResellerPanel enterprise={enterprise} />}
        </CardContent>
      </Card>
    </>
  );
}
