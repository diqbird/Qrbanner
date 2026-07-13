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
  const [mfaCode, setMfaCode] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const sessionName = session?.user?.name;
    if (sessionName != null) setName(sessionName);
  }, [session?.user?.name]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/mfa');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setMfaEnabled(Boolean(data.enabled));
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useSettingsBillingSuccess({ t, setPlanRefresh });

  const { handleUpdateProfile, handleChangePassword } = useSettingsProfileActions({
    t,
    name,
    currentPassword,
    newPassword,
    mfaCode,
    mfaEnabled,
    setCurrentPassword,
    setNewPassword,
    setMfaCode,
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
    mfaCode,
    setMfaCode,
    mfaEnabled,
    saving,
    handleUpdateProfile,
    handleChangePassword,
  };
}

export type SettingsAccountState = ReturnType<typeof useSettingsAccount>;
