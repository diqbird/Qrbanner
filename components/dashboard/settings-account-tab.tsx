'use client';

import { MfaSettings } from '@/components/dashboard/mfa-settings';
import type { SettingsAccountState } from '@/hooks/use-settings-account';
import { SettingsAccountPreferencesCard } from './settings-account-preferences-card';
import { SettingsAccountProfileCard, SettingsAccountPasswordCard } from './settings-account-profile-card';
import { SettingsAccountFooterCards } from './settings-account-footer-cards';

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
      <SettingsAccountFooterCards account={account} />
    </>
  );
}
