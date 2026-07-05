'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { validatePassword } from '@/lib/password';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

export function useResetPasswordForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error(t('auth.emailRequired'));
      return;
    }
    setResending(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data?.error, 'auth.requestFailed'));
        return;
      }
      toast.success(t('auth.resendSuccess'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t('auth.emailRequired'));
      return;
    }
    if (code.replace(/\D/g, '').length !== 6) {
      toast.error(t('auth.resetCodeRequired'));
      return;
    }
    if (password !== confirm) {
      toast.error(t('auth.passwordsMismatch'));
      return;
    }
    const check = validatePassword(password);
    if (!check.ok) {
      toast.error(resolveApiError(t, check.code));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data?.error, 'auth.resetFailed'));
        return;
      }
      toast.success(t('auth.passwordUpdated'));
      router.replace('/login');
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return {
    t,
    email,
    setEmail,
    code,
    setCode,
    password,
    setPassword,
    confirm,
    setConfirm,
    showPassword,
    setShowPassword,
    loading,
    resending,
    handleResend,
    handleSubmit,
  };
}

export type ResetPasswordFormState = ReturnType<typeof useResetPasswordForm>;
