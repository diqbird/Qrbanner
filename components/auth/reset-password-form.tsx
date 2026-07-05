'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { AuthFormShell } from './auth-form-shell';
import { useResetPasswordForm } from '@/hooks/use-reset-password-form';
import { ResetPasswordFormFields } from './reset-password-form-fields';

export function ResetPasswordForm() {
  const { t } = useLanguage();
  const form = useResetPasswordForm();

  return (
    <AuthFormShell
      title={t('auth.resetTitle')}
      subtitle={t('auth.resetCodeSubtitle')}
      homeAria={t('common.homeAria')}
    >
      <ResetPasswordFormFields form={form} />
    </AuthFormShell>
  );
}
