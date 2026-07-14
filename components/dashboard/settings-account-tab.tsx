'use client';

import { MfaSettings } from '@/components/dashboard/mfa-settings';
import { LoginHistoryPanel } from '@/components/dashboard/login-history-panel';
import type { SettingsAccountState } from '@/hooks/use-settings-account';
import { SettingsAccountPreferencesCard } from './settings-account-preferences-card';
import { SettingsAccountProfileCard, SettingsAccountPasswordCard } from './settings-account-profile-card';
import { SettingsAccountFooterCards } from './settings-account-footer-cards';
import { SettingsAccountDeleteCard } from './settings-account-delete-card';

type SettingsAccountTabProps = {
  account: SettingsAccountState;
};

export function SettingsAccountTab({ account }: SettingsAccountTabProps) {
  return (
    <>
      <SettingsAccountPreferencesCard account={account} />
      <SettingsAccountProfileCard account={account} />
      <SettingsAccountPasswordCard account={account} />
      <MfaSettings />
      <LoginHistoryPanel />
      <SettingsAccountDeleteCard account={account} />
      <SettingsAccountFooterCards account={account} />
    </>
  );
}
