'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TurnstileField } from '@/components/security/turnstile-field';

function sanitizeMfaInput(value: string): string {
  return value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase().slice(0, 19);
}

export function LoginFormMfaSection({
  t,
  mfaStep,
  totpCode,
  setTotpCode,
  rememberMe,
  setRememberMe,
  turnstileRequired,
  turnstileToken,
  setTurnstileToken,
}: {
  t: (key: string) => string;
  mfaStep: boolean;
  totpCode: string;
  setTotpCode: (v: string) => void;
  rememberMe: boolean;
  setRememberMe: (v: boolean) => void;
  turnstileRequired: boolean;
  turnstileToken: string | null;
  setTurnstileToken: (token: string | null) => void;
}) {
  return (
    <>
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
          <Label htmlFor="totp-code">{t('settings.mfa.codeOrRecoveryLabel')}</Label>
          <Input
            id="totp-code"
            autoComplete="one-time-code"
            placeholder={t('settings.mfa.codeOrRecoveryPlaceholder')}
            value={totpCode}
            onChange={(e) => setTotpCode(sanitizeMfaInput(e.target.value))}
            className="text-center font-mono tracking-widest"
            required
          />
        </div>
      )}
      {turnstileRequired && !mfaStep && (
        <TurnstileField onToken={setTurnstileToken} className="flex justify-center py-1" />
      )}
    </>
  );
}
