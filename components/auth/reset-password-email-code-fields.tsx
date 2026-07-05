'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, KeyRound } from 'lucide-react';
import type { ResetPasswordFormState } from '@/hooks/use-reset-password-form';

export function ResetPasswordEmailCodeFields({ form }: { form: ResetPasswordFormState }) {
  const { t, email, setEmail, code, setCode, resending, handleResend } = form;

  return (
    <>
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
    </>
  );
}
