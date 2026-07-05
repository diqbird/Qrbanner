'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { TurnstileField } from '@/components/security/turnstile-field';
import type { LoginFormState } from '@/hooks/use-login-form';

type LoginFormCredentialsProps = {
  login: LoginFormState;
};

export function LoginFormCredentials({ login }: LoginFormCredentialsProps) {
  const {
    t,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    mfaStep,
    totpCode,
    setTotpCode,
    turnstileToken,
    setTurnstileToken,
    rememberMe,
    setRememberMe,
    turnstileRequired,
    handleSubmit,
  } = login;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t('common.password')}</Label>
          <Link href="/forgot-password" className="text-xs text-primary hover:underline">
            {t('auth.forgotPassword')}
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 pr-10"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>
      {!mfaStep && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label htmlFor="remember-me" className="cursor-pointer text-sm font-normal">
            {t('auth.rememberMe')}
          </Label>
        </div>
      )}
      {mfaStep && (
        <div className="space-y-2">
          <Label htmlFor="totp-code">{t('settings.mfa.codeLabel')}</Label>
          <Input
            id="totp-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center font-mono tracking-widest"
            maxLength={6}
            required
          />
        </div>
      )}
      {turnstileRequired && !mfaStep && (
        <TurnstileField onToken={setTurnstileToken} className="flex justify-center py-1" />
      )}
      <Button type="submit" className="w-full" loading={loading}>
        {mfaStep ? t('settings.mfa.verify') : t('common.signIn')}
      </Button>
    </form>
  );
}
