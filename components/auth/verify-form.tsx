'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/i18n/language-provider';
import { AuthFormShell } from './auth-form-shell';
import { useVerifyForm } from '@/hooks/use-verify-form';
import { VerifyFormFields } from './verify-form-fields';

export function VerifyForm() {
  const { t } = useLanguage();
  const form = useVerifyForm();
  const { callbackUrl } = form;

  return (
    <AuthFormShell
      title={t('auth.verifyTitle')}
      subtitle={t('auth.verifySubtitle')}
      homeAria={t('common.homeAria')}
      footer={
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
      }
    >
      <VerifyFormFields form={form} />
    </AuthFormShell>
  );
}
