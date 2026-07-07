'use client';

import { getPasswordStrength, type PasswordStrength } from '@/lib/password';
import { useLanguage } from '@/components/i18n/language-provider';
import { passwordPolicyVars } from '@/lib/i18n/password-policy-vars';

const STRENGTH_COLORS: Record<PasswordStrength, string> = {
  weak: 'bg-red-500',
  fair: 'bg-amber-500',
  good: 'bg-emerald-500',
  strong: 'bg-green-600',
};

const STRENGTH_WIDTH: Record<PasswordStrength, string> = {
  weak: '25%',
  fair: '50%',
  good: '75%',
  strong: '100%',
};

const STRENGTH_KEYS: Record<PasswordStrength, string> = {
  weak: 'auth.strengthWeak',
  fair: 'auth.strengthFair',
  good: 'auth.strengthGood',
  strong: 'auth.strengthStrong',
};

export function PasswordStrengthMeter({ password }: { password: string }) {
  const { t, locale } = useLanguage();
  if (!password) return null;
  const strength = getPasswordStrength(password);
  const policyVars = passwordPolicyVars(locale);
  return (
    <div className="space-y-1">
      <div className="flex h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`transition-all ${STRENGTH_COLORS[strength]}`}
          style={{ width: STRENGTH_WIDTH[strength] }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {t('auth.passwordStrengthHint', { strength: t(STRENGTH_KEYS[strength]), ...policyVars })}
      </p>
    </div>
  );
}
