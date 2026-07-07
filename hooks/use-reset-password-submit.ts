'use client';

import { toast } from 'sonner';
import { validatePassword } from '@/lib/password';
import { PASSWORD_MIN_LENGTH } from '@/lib/password-policy';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

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
      toast.error(resolveApiError(t, check.code, 'auth.somethingWrong', { min: PASSWORD_MIN_LENGTH }));
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
