'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { PasswordStrengthMeter } from './password-strength-meter';
import type { ResetPasswordFormState } from '@/hooks/use-reset-password-form';

export function ResetPasswordCredentialFields({ form }: { form: ResetPasswordFormState }) {
  const { t, password, setPassword, confirm, setConfirm, showPassword, setShowPassword } = form;

  return (
    <>
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
    </>
  );
}
