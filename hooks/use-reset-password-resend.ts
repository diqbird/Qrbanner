'use client';

import { toast } from 'sonner';
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
