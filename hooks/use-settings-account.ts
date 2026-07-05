'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useSettingsBillingSuccess } from '@/hooks/use-settings-billing-success';
import { useSettingsProfileActions } from '@/hooks/use-settings-profile-actions';

export function useSettingsAccount() {
  const { t } = useLanguage();
  const { data: session } = useSession() || {};
  const [planRefresh, setPlanRefresh] = useState(0);
  const [name, setName] = useState(session?.user?.name ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const sessionName = session?.user?.name;
    if (sessionName != null) setName(sessionName);
  }, [session?.user?.name]);

  useSettingsBillingSuccess({ t, setPlanRefresh });

  const { handleUpdateProfile, handleChangePassword } = useSettingsProfileActions({
    t,
    name,
    currentPassword,
    newPassword,
    setCurrentPassword,
    setNewPassword,
    setSaving,
  });

  return {
    t,
    session,
    planRefresh,
    name,
    setName,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    saving,
    handleUpdateProfile,
    handleChangePassword,
  };
}

export type SettingsAccountState = ReturnType<typeof useSettingsAccount>;
