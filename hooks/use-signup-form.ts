'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { resolveCallbackUrl } from '@/lib/auth-providers';
import { ONBOARDING_CREATE_URL } from '@/lib/onboarding';
import { validatePassword } from '@/lib/password';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { isTurnstileEnabledClient } from '@/components/security/turnstile-field';

export function useSignupForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get('callbackUrl');
  const callbackUrl = rawCallback ? resolveCallbackUrl(rawCallback) : ONBOARDING_CREATE_URL;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRequired = isTurnstileEnabledClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error(t('auth.termsRequired'));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t('auth.passwordsMismatch'));
      return;
    }

    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) {
      toast.error(resolveApiError(t, pwCheck.code));
      return;
    }

    if (turnstileRequired && !turnstileToken) {
      toast.error(t('auth.captchaRequired'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          referralCode: searchParams.get('ref'),
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(resolveApiError(t, data?.error, 'auth.signupFailed'));
        return;
      }

      toast.success(t('auth.accountCreated'));
      const verifyQs = new URLSearchParams({ email });
      if (callbackUrl !== '/dashboard') verifyQs.set('callbackUrl', callbackUrl);
      router.replace(`/verify?${verifyQs.toString()}`);
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return {
    t,
    callbackUrl,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    termsAccepted,
    setTermsAccepted,
    loading,
    setTurnstileToken,
    handleSubmit,
  };
}

export type SignupFormState = ReturnType<typeof useSignupForm>;
