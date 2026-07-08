'use client';

import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { useLoginSsoPolicy } from '@/hooks/use-login-sso-policy';

type Translate = (key: string) => string;

export function useLoginFormSubmit({
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
}: {
  t: Translate;
  callbackUrl: string;
  email: string;
  password: string;
  mfaStep: boolean;
  totpCode: string;
  turnstileToken: string | null;
  turnstileRequired: boolean;
  rememberMe: boolean;
  setLoading: (loading: boolean) => void;
  setMfaStep: (step: boolean) => void;
}) {
  const { checkSsoPolicy } = useLoginSsoPolicy();

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
        let dest = callbackUrl;
        try {
          const sessionRes = await fetch('/api/auth/session');
          if (sessionRes.ok) {
            const session = (await sessionRes.json()) as { user?: { role?: string } };
            if (session.user?.role === 'admin' && !callbackUrl.startsWith('/admin')) {
              dest = '/admin';
            }
          }
        } catch {
          /* keep callbackUrl */
        }
        window.location.href = dest;
        return;
      }

      toast.error(t('auth.signInFailed'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return { checkSsoPolicy, handleSubmit };
}
