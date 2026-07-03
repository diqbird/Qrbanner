'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import type { OAuthProviderId } from '@/lib/auth-providers';
import { resolveCallbackUrl } from '@/lib/auth-providers';
import { ONBOARDING_CREATE_URL } from '@/lib/onboarding';
import { OAuthButtons } from './oauth-buttons';
import { validatePassword } from '@/lib/password';
import { PasswordStrengthMeter } from './password-strength-meter';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { ReferralSignupBanner } from './referral-signup-banner';
import { ReferralCookieSync } from './referral-cookie-sync';
import { TurnstileField, isTurnstileEnabledClient } from '@/components/security/turnstile-field';

export function SignupForm({ oauthProviders = [] }: { oauthProviders?: OAuthProviderId[] }) {
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
      toast.error(resolveApiError(t, pwCheck.code));
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
          referralCode: searchParams.get('ref'),
          turnstileToken,
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher />
        </div>
        <Link href="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <QrCode className="h-7 w-7 text-primary-foreground" />
        </Link>
        <CardTitle className="font-display text-2xl tracking-tight">{t('auth.createAccount')}</CardTitle>
        <CardDescription>{t('auth.createAccountSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ReferralCookieSync />
        <ReferralSignupBanner />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('auth.fullName')}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                placeholder={t('common.namePlaceholder')}
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('common.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={t('common.emailPlaceholder')}
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('common.password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <PasswordStrengthMeter password={password} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(v) => setTermsAccepted(v === true)}
            />
            <Label htmlFor="terms" className="text-sm font-normal leading-snug text-muted-foreground">
              {t('auth.termsAgree')}{' '}
              <Link href="/terms" className="text-primary hover:underline" target="_blank">
                {t('footer.terms')}
              </Link>{' '}
              {t('auth.termsAnd')}{' '}
              <Link href="/privacy" className="text-primary hover:underline" target="_blank">
                {t('footer.privacy')}
              </Link>
            </Label>
          </div>
          <TurnstileField onToken={setTurnstileToken} className="flex justify-center py-1" />
          <Button type="submit" className="w-full" loading={loading}>
            {t('auth.createAccountBtn')}
          </Button>
        </form>

        <OAuthButtons providers={oauthProviders} callbackUrl={callbackUrl} dividerLabel={t('auth.orSignUpWith')} />

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('auth.hasAccount')}{' '}
          <Link
            href={
              callbackUrl !== '/dashboard'
                ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : '/login'
            }
            className="font-medium text-primary hover:underline"
          >
            {t('common.signIn')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
