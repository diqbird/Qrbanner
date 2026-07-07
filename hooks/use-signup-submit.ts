'use client';

import { toast } from 'sonner';
import { validatePassword } from '@/lib/password';
import { PASSWORD_MIN_LENGTH } from '@/lib/password-policy';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useSignupSubmit({
  t,
  email,
  password,
  confirmPassword,
  name,
  termsAccepted,
  turnstileRequired,
  turnstileToken,
  referralCode,
  callbackUrl,
  locale,
  router,
  setLoading,
}: {
  t: Translate;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  termsAccepted: boolean;
  turnstileRequired: boolean;
  turnstileToken: string | null;
  referralCode: string | null;
  callbackUrl: string;
  locale: 'en' | 'tr';
  router: { replace: (url: string) => void };
  setLoading: (v: boolean) => void;
}) {
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
      toast.error(resolveApiError(t, pwCheck.code, 'auth.somethingWrong', { min: PASSWORD_MIN_LENGTH }));
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
          referralCode,
          turnstileToken,
          locale,
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

  return { handleSubmit };
}
