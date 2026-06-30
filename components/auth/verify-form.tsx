'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, MailCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { resolveCallbackUrl } from '@/lib/auth-providers';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';

export function VerifyForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = resolveCallbackUrl(searchParams?.get('callbackUrl'));
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const e = searchParams?.get('email');
    if (e) setEmail(e);
  }, [searchParams]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) {
      toast.error(t('auth.verifyFieldsRequired'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data?.error, 'auth.verifyFailed'));
        return;
      }

      toast.success(t('auth.verifySuccess'));

      if (data.loginToken) {
        const result = await signIn('credentials', {
          email,
          verifyToken: data.loginToken,
          redirect: false,
        });
        if (!result?.error) {
          router.replace(callbackUrl);
          return;
        }
      }
      router.replace('/login');
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error(t('auth.emailRequired'));
      return;
    }
    setResending(true);
    try {
      const res = await fetch('/api/verify/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data?.error, 'auth.resendFailed'));
        return;
      }
      toast.success(t('auth.resendSuccess'));
      setCooldown(45);
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mb-2 flex justify-end">
          <LanguageSwitcher />
        </div>
        <Link href="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <QrCode className="h-7 w-7 text-primary-foreground" />
        </Link>
        <CardTitle className="font-display text-2xl tracking-tight">{t('auth.verifyTitle')}</CardTitle>
        <CardDescription>{t('auth.verifySubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('common.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('common.verifyEmailPlaceholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">{t('auth.verificationCode')}</Label>
            <Input
              id="code"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder={t('common.verifyCodePlaceholder')}
              className="text-center text-2xl font-semibold tracking-[0.5em]"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('auth.verifying')}
              </>
            ) : (
              <>
                <MailCheck className="mr-2 h-4 w-4" /> {t('auth.verifyEmail')}
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {t('auth.didntReceive')}{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="font-medium text-primary hover:underline disabled:no-underline disabled:opacity-50"
          >
            {cooldown > 0
              ? t('auth.resendIn', { seconds: cooldown })
              : resending
                ? t('auth.resending')
                : t('auth.resendCode')}
          </button>
        </div>

        <div className="mt-2 text-center text-sm">
          <Link
            href={
              callbackUrl !== '/dashboard'
                ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : '/login'
            }
            className="text-muted-foreground hover:underline"
          >
            {t('auth.backToSignIn')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
