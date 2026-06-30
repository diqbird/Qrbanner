import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Reset Password',
  description: 'Choose a new password for your QRbanner account.',
  path: '/reset-password',
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
