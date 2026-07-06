'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/components/i18n/language-provider';
import { useResetPasswordResend, useResetPasswordSubmit } from '@/hooks/use-reset-password-form-actions';

export function useResetPasswordForm() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const { handleResend } = useResetPasswordResend({ t, email, locale, setResending });
  const { handleSubmit } = useResetPasswordSubmit({
    t,
    email,
    code,
    password,
    confirm,
    router,
    setLoading,
  });

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
