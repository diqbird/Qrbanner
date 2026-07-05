'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { resolveCallbackUrl } from '@/lib/auth-providers';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { isTurnstileEnabledClient } from '@/components/security/turnstile-field';
import { useLoginSsoEffects } from '@/hooks/use-login-sso-effects';
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

  const checkSsoPolicy = useCallback(async (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setSsoPolicy(null);
      return;
    }
    try {
      const res = await fetch(`/api/auth/sso-policy?email=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = (await res.json()) as SsoPolicy;
        setSsoPolicy(data);
      }
    } catch {
      setSsoPolicy(null);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (turnstileRequired && !turnstileToken) {
      toast.error(t('auth.captchaRequired'));
      return;
    }

    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        turnstileToken: turnstileToken ?? undefined,
        rememberMe: rememberMe ? 'true' : 'false',
        totpCode: mfaStep ? totpCode : undefined,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        if (result.error === 'EMAIL_NOT_VERIFIED') {
          toast.error(t('auth.verifyEmailFirst'));
          const verifyQs = new URLSearchParams({ email });
          if (callbackUrl !== '/dashboard') verifyQs.set('callbackUrl', callbackUrl);
          window.location.href = `/verify?${verifyQs.toString()}`;
          return;
        }
        if (result.error === 'mfa_required') {
          setMfaStep(true);
          toast.message(t('settings.mfa.enterCodePrompt'));
          return;
        }
        toast.error(resolveApiError(t, result.error));
        return;
      }

      if (result?.ok) {
        toast.success(t('auth.signedInSuccess'));
        window.location.href = callbackUrl;
        return;
      }

      toast.error(t('auth.signInFailed'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

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
