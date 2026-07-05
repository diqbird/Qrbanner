'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsAccount } from '@/hooks/use-settings-account';
import { SettingsAccountTab } from './settings-account-tab';
import { SettingsPlanTab } from './settings-plan-tab';
import { SettingsTeamTab } from './settings-team-tab';
import { SettingsIntegrationsTab } from './settings-integrations-tab';
import { SettingsBrandTab } from './settings-brand-tab';

export function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const account = useSettingsAccount();
  const { t, planRefresh } = account;
  const rawTab = searchParams.get('tab') ?? 'account';
  const settingsTab = rawTab === 'saml' ? 'team' : rawTab;

  useEffect(() => {
    if (rawTab !== 'saml') return;
    const timer = window.setTimeout(() => {
      document.getElementById('saml-wizard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [rawTab]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{t('dashboard.settings')}</h1>
        <p className="mt-1 text-muted-foreground">{t('settings.subtitle')}</p>
      </div>

      <Tabs
        value={settingsTab}
        onValueChange={(value) => router.replace(`/settings?tab=${value}`, { scroll: false })}
        className="space-y-6"
      >
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="account">{t('settings.tabAccount')}</TabsTrigger>
          <TabsTrigger value="plan">{t('settings.tabPlan')}</TabsTrigger>
          <TabsTrigger value="team">{t('settings.tabTeam')}</TabsTrigger>
          <TabsTrigger value="integrations">{t('settings.tabIntegrations')}</TabsTrigger>
          <TabsTrigger value="brand">{t('settings.tabBrand')}</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6 mt-0">
          <SettingsAccountTab account={account} />
        </TabsContent>
        <TabsContent value="plan" className="space-y-6 mt-0">
          <SettingsPlanTab planRefresh={planRefresh} />
        </TabsContent>
        <TabsContent value="team" className="space-y-6 mt-0">
          <SettingsTeamTab />
        </TabsContent>
        <TabsContent value="integrations" className="space-y-6 mt-0">
          <SettingsIntegrationsTab />
        </TabsContent>
        <TabsContent value="brand" className="space-y-6 mt-0">
          <SettingsBrandTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
