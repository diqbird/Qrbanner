'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resolveCallbackUrl } from '@/lib/auth-providers';
import { useLanguage } from '@/components/i18n/language-provider';
import { useVerifySubmit, useVerifyResend } from '@/hooks/use-verify-form-actions';

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

  const { handleVerify } = useVerifySubmit({ t, email, code, callbackUrl, router, setLoading });
  const { handleResend } = useVerifyResend({ t, email, setResending, setCooldown });

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
