'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import type { OAuthProviderId } from '@/lib/auth-providers';
import { resolveCallbackUrl } from '@/lib/auth-providers';
import { OAuthButtons } from './oauth-buttons';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { ReferralCookieSync } from './referral-cookie-sync';

export function LoginForm({ oauthProviders = [] }: { oauthProviders?: OAuthProviderId[] }) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const callbackUrl = resolveCallbackUrl(searchParams.get('callbackUrl'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [samlInfo, setSamlInfo] = useState<{ enabled: boolean; name?: string; loginUrl?: string } | null>(null);

  const workspaceSlug = searchParams.get('workspace')?.trim() ?? '';

  useEffect(() => {
    const samlToken = searchParams.get('samlToken');
    const samlEmail = searchParams.get('email');
    if (!samlToken || !samlEmail) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await signIn('credentials', {
          email: samlEmail,
          verifyToken: samlToken,
          redirect: false,
          callbackUrl,
        });
        if (cancelled) return;
        if (result?.error) {
          toast.error(resolveApiError(t, result.error));
          return;
        }
        if (result?.ok) {
          toast.success(t('auth.signedInSuccess'));
          window.location.href = callbackUrl;
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, callbackUrl, t]);

  useEffect(() => {
    if (!workspaceSlug) {
      setSamlInfo(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/auth/saml/info?workspace=${encodeURIComponent(workspaceSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSamlInfo(data?.enabled ? data : { enabled: false });
      })
      .catch(() => {
        if (!cancelled) setSamlInfo({ enabled: false });
      });
    return () => {
      cancelled = true;
    };
  }, [workspaceSlug]);

  useEffect(() => {
    const error = searchParams.get('error');
    if (!error || error === 'Callback') return;
    const code = error === 'AccessDenied' ? 'sso_required' : error;
    toast.error(resolveApiError(t, code));
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher />
        </div>
        <Link href="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <QrCode className="h-7 w-7 text-primary-foreground" />
        </Link>
        <CardTitle className="font-display text-2xl tracking-tight">{t('auth.welcomeBack')}</CardTitle>
        <CardDescription>{t('auth.signInSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ReferralCookieSync />
        <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete="email"
              />
            </div>
          </div>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            {t('common.signIn')}
          </Button>
        </form>

        <OAuthButtons providers={oauthProviders} callbackUrl={callbackUrl} />

        {samlInfo?.enabled && samlInfo.loginUrl && (
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = samlInfo.loginUrl!;
              }}
            >
              {t('settings.team.signInWithSaml')}
              {samlInfo.name ? ` (${samlInfo.name})` : ''}
            </Button>
          </div>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link
            href={
              callbackUrl !== '/dashboard'
                ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : '/signup'
            }
            className="font-medium text-primary hover:underline"
          >
            {t('auth.signUpFree')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
