'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MailCheck, Loader2 } from 'lucide-react';
import type { VerifyFormState } from '@/hooks/use-verify-form';

export function VerifyFormFields({ form }: { form: VerifyFormState }) {
  const {
    t,
    email,
    setEmail,
    code,
    setCode,
    loading,
    resending,
    cooldown,
    handleVerify,
    handleResend,
  } = form;

  return (
    <>
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
    </>
  );
}
