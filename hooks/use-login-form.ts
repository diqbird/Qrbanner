'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { resolveCallbackUrl } from '@/lib/auth-providers';
import { useLanguage } from '@/components/i18n/language-provider';
import { isTurnstileEnabledClient } from '@/components/security/turnstile-field';
import { useLoginSsoEffects } from '@/hooks/use-login-sso-effects';
import { useLoginFormSubmit } from '@/hooks/use-login-form-submit';
import type { SamlInfo, SsoPolicy } from '@/lib/login-form-types';

export function useLoginForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const callbackUrl = resolveCallbackUrl(searchParams.get('callbackUrl'));
  const workspaceSlug = searchParams.get('workspace')?.trim() ?? '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mfaStep, setMfaStep] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [samlInfo, setSamlInfo] = useState<SamlInfo | null>(null);
  const [ssoPolicy, setSsoPolicy] = useState<SsoPolicy | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const turnstileRequired = isTurnstileEnabledClient();

  useLoginSsoEffects({ callbackUrl, workspaceSlug, setLoading, setSamlInfo });

  const { checkSsoPolicy: checkSsoPolicyInner, handleSubmit } = useLoginFormSubmit({
    t,
    callbackUrl,
    email,
    password,
    mfaStep,
    totpCode,
    turnstileToken,
    turnstileRequired,
    rememberMe,
    setLoading,
    setMfaStep,
  });

  const checkSsoPolicy = (value: string) => checkSsoPolicyInner(value, setSsoPolicy);

  const passwordAllowed = ssoPolicy ? ssoPolicy.passwordAllowed : true;

  return {
    t,
    callbackUrl,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    mfaStep,
    totpCode,
    setTotpCode,
    samlInfo,
    ssoPolicy,
    turnstileToken,
    setTurnstileToken,
    rememberMe,
    setRememberMe,
    turnstileRequired,
    passwordAllowed,
    checkSsoPolicy,
    handleSubmit,
  };
}

export type LoginFormState = ReturnType<typeof useLoginForm>;
