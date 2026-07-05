'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { resolveCallbackUrl } from '@/lib/auth-providers';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

export function useVerifyForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = resolveCallbackUrl(searchParams?.get('callbackUrl'));
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const e = searchParams?.get('email');
    if (e) setEmail(e);
  }, [searchParams]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

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

  return {
    t,
    callbackUrl,
    email,
    setEmail,
    code,
    setCode,
    loading,
    resending,
    cooldown,
    handleVerify,
    handleResend,
  };
}

export type VerifyFormState = ReturnType<typeof useVerifyForm>;
