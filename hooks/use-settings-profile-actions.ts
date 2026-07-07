'use client';

import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { PASSWORD_MIN_LENGTH } from '@/lib/password-policy';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useSettingsProfileActions({
  t,
  name,
  currentPassword,
  newPassword,
  setCurrentPassword,
  setNewPassword,
  setSaving,
}: {
  t: Translate;
  name: string;
  currentPassword: string;
  newPassword: string;
  setCurrentPassword: (v: string) => void;
  setNewPassword: (v: string) => void;
  setSaving: (v: boolean) => void;
}) {
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
        toast.error(resolveApiError(t, data?.error, 'settings.passwordChangeFailed', { min: PASSWORD_MIN_LENGTH }));
      }
    } catch {
      toast.error(t('bulk.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

  return { handleUpdateProfile, handleChangePassword };
}
