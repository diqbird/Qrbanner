'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { TurnstileField, isTurnstileEnabledClient } from '@/components/security/turnstile-field';

export function ForgotPasswordForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRequired = isTurnstileEnabledClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (turnstileRequired && !turnstileToken) {
      toast.error(t('auth.captchaRequired'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data?.error, 'auth.requestFailed'));
        return;
      }
      toast.success(t('auth.resetCodeSent'));
      router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
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
        <CardTitle className="font-display text-2xl tracking-tight">{t('auth.forgotTitle')}</CardTitle>
        <CardDescription>{t('auth.forgotSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
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
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
                autoComplete="email"
              />
            </div>
          </div>
          <TurnstileField onToken={setTurnstileToken} className="flex justify-center py-1" />
          <Button type="submit" className="w-full" loading={loading}>
            {t('auth.sendResetCode')}
          </Button>
          <Link href="/login" className="block text-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="inline h-3.5 w-3.5 mr-1" />
            {t('auth.backToSignIn')}
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
