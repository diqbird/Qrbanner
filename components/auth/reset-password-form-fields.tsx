'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { ResetPasswordFormState } from '@/hooks/use-reset-password-form';
import { ResetPasswordEmailCodeFields } from './reset-password-email-code-fields';
import { ResetPasswordCredentialFields } from './reset-password-credential-fields';

export function ResetPasswordFormFields({ form }: { form: ResetPasswordFormState }) {
  const { t, loading, handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ResetPasswordEmailCodeFields form={form} />
      <ResetPasswordCredentialFields form={form} />
      <Button type="submit" className="w-full" loading={loading}>
        {t('auth.updatePassword')}
      </Button>
      <Link href="/forgot-password" className="block text-center text-sm text-muted-foreground hover:text-primary">
        {t('auth.requestNewLink')}
      </Link>
    </form>
  );
}
