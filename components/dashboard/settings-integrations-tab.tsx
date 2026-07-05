'use client';

import { ApiKeySettings } from '@/components/dashboard/api-key-settings';
import { WebhookSettings } from '@/components/dashboard/webhook-settings';
import { AutomationBuilder } from '@/components/dashboard/automation-builder';
import { CustomDomainSettings } from '@/components/dashboard/custom-domain-settings';
import { SettingsSection } from '@/components/dashboard/settings-section';
import { useLanguage } from '@/components/i18n/language-provider';

export function SettingsIntegrationsTab() {
  const { t } = useLanguage();

  return (
    <>
      <SettingsSection title={t('settings.sectionApi')} description={t('settings.sectionApiDesc')} />
      <ApiKeySettings />
      <WebhookSettings />
      <SettingsSection title={t('settings.sectionAutomation')} description={t('settings.sectionAutomationDesc')} />
      <AutomationBuilder />
      <SettingsSection title={t('settings.sectionDomain')} description={t('settings.sectionDomainDesc')} />
      <CustomDomainSettings />
    </>
  );
}
