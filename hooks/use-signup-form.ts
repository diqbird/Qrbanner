'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resolveCallbackUrl } from '@/lib/auth-providers';
import { ONBOARDING_CREATE_URL } from '@/lib/onboarding';
import { useLanguage } from '@/components/i18n/language-provider';
import { isTurnstileEnabledClient } from '@/components/security/turnstile-field';
import { useSignupSubmit } from '@/hooks/use-signup-submit';

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

  const { handleSubmit } = useSignupSubmit({
    t,
    email,
    password,
    confirmPassword,
    name,
    termsAccepted,
    turnstileRequired,
    turnstileToken,
    referralCode: searchParams.get('ref'),
    callbackUrl,
    router,
    setLoading,
  });

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
