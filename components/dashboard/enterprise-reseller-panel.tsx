'use client';

import { Switch } from '@/components/ui/switch';
import { Users } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { EnterpriseWorkspaceState } from '@/hooks/use-enterprise-workspace';
import { EnterpriseResellerClientForm } from './enterprise-reseller-client-form';
import { EnterpriseResellerClientList } from './enterprise-reseller-client-list';

type EnterpriseResellerPanelProps = {
  enterprise: EnterpriseWorkspaceState;
};

export function EnterpriseResellerPanel({ enterprise }: EnterpriseResellerPanelProps) {
  const { locale } = useLanguage();
  const { t, state, clients, clientLimit, toggleReseller } = enterprise;

  if (!state) return null;
  const { workspace } = state;

  return (
    <div className="rounded-lg border border-border/50 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">{t('enterpriseWorkspace.resellerTitle')}</p>
      </div>
      <p className="text-xs text-muted-foreground">{t('enterpriseWorkspace.resellerDesc')}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('enterpriseWorkspace.enableReseller')}</span>
        <Switch checked={workspace.resellerEnabled} onCheckedChange={toggleReseller} />
      </div>
      {workspace.resellerEnabled && (
        <>
          <p className="text-xs text-muted-foreground">
            {t('enterpriseWorkspace.clientCount', {
              count: formatLocaleNumber(clients.length, locale),
              limit: formatLocaleNumber(clientLimit, locale),
            })}
          </p>
          <EnterpriseResellerClientForm enterprise={enterprise} />
          <EnterpriseResellerClientList enterprise={enterprise} />
        </>
      )}
    </div>
  );
}
