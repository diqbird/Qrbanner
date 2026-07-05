'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, Mail, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { validatePassword } from '@/lib/password';
import { PasswordStrengthMeter } from './password-strength-meter';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { AuthFormShell } from './auth-form-shell';

export function ResetPasswordForm() {
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

  return (
    <AuthFormShell
      title={t('auth.resetTitle')}
      subtitle={t('auth.resetCodeSubtitle')}
      homeAria={t('common.homeAria')}
    >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('common.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
                autoComplete="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">{t('auth.resetCode')}</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder={t('auth.resetCodePlaceholder')}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                className="pl-10 tracking-[0.4em] font-mono"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('auth.didntReceive')}</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-primary hover:underline disabled:opacity-60"
              >
                {resending ? t('auth.resending') : t('auth.resendCode')}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.newPassword')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <PasswordStrengthMeter password={password} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">{t('auth.confirmPassword')}</Label>
            <Input
              id="confirm"
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            {t('auth.updatePassword')}
          </Button>
          <Link href="/forgot-password" className="block text-center text-sm text-muted-foreground hover:text-primary">
            {t('auth.requestNewLink')}
          </Link>
        </form>
    </AuthFormShell>
  );
}
