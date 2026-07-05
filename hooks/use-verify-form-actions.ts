'use client';

import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

type Translate = (key: string) => string;

export function useVerifySubmit({
  t,
  email,
  code,
  callbackUrl,
  router,
  setLoading,
}: {
  t: Translate;
  email: string;
  code: string;
  callbackUrl: string;
  router: { replace: (url: string) => void };
  setLoading: (loading: boolean) => void;
}) {
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) {
      toast.error(t('auth.verifyFieldsRequired'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data?.error, 'auth.verifyFailed'));
        return;
      }

      toast.success(t('auth.verifySuccess'));

      if (data.loginToken) {
        const result = await signIn('credentials', {
          email,
          verifyToken: data.loginToken,
          redirect: false,
        });
        if (!result?.error) {
          router.replace(callbackUrl);
          return;
        }
      }
      router.replace('/login');
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return { handleVerify };
}

export function useVerifyResend({
  t,
  email,
  setResending,
  setCooldown,
}: {
  t: Translate;
  email: string;
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
        body: JSON.stringify({ email }),
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
