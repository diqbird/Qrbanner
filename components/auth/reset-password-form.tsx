'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { validatePassword } from '@/lib/password';
import { PasswordStrengthMeter } from './password-strength-meter';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';

export function ResetPasswordForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error(t('auth.passwordsMismatch'));
      return;
    }
    const check = validatePassword(password);
    if (!check.ok) {
      toast.error(resolveApiError(t, check.code));
      return;
    }
    if (!token) {
      toast.error(t('auth.invalidResetLink'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
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

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 text-center space-y-4">
          <p className="text-muted-foreground">{t('auth.invalidResetLink')}</p>
          <Link href="/forgot-password">
            <Button>{t('auth.requestNewLink')}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher />
        </div>
        <Link href="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <QrCode className="h-7 w-7 text-primary-foreground" />
        </Link>
        <CardTitle className="font-display text-2xl tracking-tight">{t('auth.resetTitle')}</CardTitle>
        <CardDescription>{t('auth.resetSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
        </form>
      </CardContent>
    </Card>
  );
}
