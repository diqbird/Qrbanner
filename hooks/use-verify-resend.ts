'use client';

import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

type Translate = (key: string) => string;

export function useVerifyResend({
  t,
  email,
  locale,
  setResending,
  setCooldown,
}: {
  t: Translate;
  email: string;
  locale: 'en' | 'tr';
  setResending: (resending: boolean) => void;
  setCooldown: (cooldown: number | ((c: number) => number)) => void;
}) {
  const handleResend = async () => {
    if (!email) {
      toast.error(t('auth.emailRequired'));
      return;
    }
    setResending(true);
    try {
      const res = await fetch('/api/verify/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data?.error, 'auth.resendFailed'));
        return;
      }
      toast.success(t('auth.resendSuccess'));
      setCooldown(45);
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setResending(false);
    }
  };

  return { handleResend };
}
