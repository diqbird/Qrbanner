'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

export function useSettingsAccount() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
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

  useEffect(() => {
    if (searchParams.get('billing') !== 'success') return;
    if (searchParams.get('_ptxn')) return;
    toast.success(t('pricing.billingSuccess'));
    setPlanRefresh((k) => k + 1);
    router.replace('/settings?tab=plan');
    let attempts = 0;
    const poll = window.setInterval(() => {
      attempts += 1;
      setPlanRefresh((k) => k + 1);
      if (attempts >= 5) window.clearInterval(poll);
    }, 2500);
    return () => window.clearInterval(poll);
  }, [searchParams, router, t]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        toast.success(t('settings.profileUpdated'));
      } else {
        toast.error(t('settings.profileUpdateFailed'));
      }
    } catch {
      toast.error(t('bulk.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error(t('settings.fillAllFields'));
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        toast.success(t('settings.passwordChanged'));
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const data = await res.json();
        toast.error(resolveApiError(t, data?.error, 'settings.passwordChangeFailed'));
      }
    } catch {
      toast.error(t('bulk.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

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
