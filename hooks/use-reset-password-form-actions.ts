'use client';

import { toast } from 'sonner';
import { validatePassword } from '@/lib/password';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

type Translate = (key: string) => string;

export function useResetPasswordResend({
  t,
  email,
  setResending,
}: {
  t: Translate;
  email: string;
  setResending: (v: boolean) => void;
}) {
  const handleResend = async () => {
    if (!email) {
      toast.error(t('auth.emailRequired'));
      return;
    }
    setResending(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data?.error, 'auth.requestFailed'));
        return;
      }
      toast.success(t('auth.resendSuccess'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setResending(false);
    }
  };

  return { handleResend };
}

export function useResetPasswordSubmit({
  t,
  email,
  code,
  password,
  confirm,
  router,
  setLoading,
}: {
  t: Translate;
  email: string;
  code: string;
  password: string;
  confirm: string;
  router: { replace: (url: string) => void };
  setLoading: (v: boolean) => void;
}) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t('auth.emailRequired'));
      return;
    }
    if (code.replace(/\D/g, '').length !== 6) {
      toast.error(t('auth.resetCodeRequired'));
      return;
    }
    if (password !== confirm) {
      toast.error(t('auth.passwordsMismatch'));
      return;
    }
    const check = validatePassword(password);
    if (!check.ok) {
      toast.error(resolveApiError(t, check.code));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data?.error, 'auth.resetFailed'));
        return;
      }
      toast.success(t('auth.passwordUpdated'));
      router.replace('/login');
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit };
}
