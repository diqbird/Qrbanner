import { Suspense } from 'react';
import { VerifyForm } from '@/components/auth/verify-form';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Verify your email',
  description: 'Enter the verification code sent to your email to activate your QRbanner account.',
  path: '/verify',
  noIndex: true,
});

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}
