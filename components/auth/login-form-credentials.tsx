'use client';

import { Button } from '@/components/ui/button';
import type { LoginFormState } from '@/hooks/use-login-form';
import { LoginFormPasswordField } from './login-form-password-field';
import { LoginFormMfaSection } from './login-form-mfa-section';

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
      <LoginFormPasswordField
        t={t}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
      <LoginFormMfaSection
        t={t}
        mfaStep={mfaStep}
        totpCode={totpCode}
        setTotpCode={setTotpCode}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        turnstileRequired={turnstileRequired}
        turnstileToken={turnstileToken}
        setTurnstileToken={setTurnstileToken}
      />
      <Button type="submit" className="w-full" loading={loading}>
        {mfaStep ? t('settings.mfa.verify') : t('common.signIn')}
      </Button>
    </form>
  );
}
