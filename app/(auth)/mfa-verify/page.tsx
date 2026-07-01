import { Suspense } from 'react';
import { MfaVerifyForm } from '@/components/auth/mfa-verify-form';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Two-Factor Authentication',
  description: 'Enter your authenticator code to continue.',
  path: '/mfa-verify',
  noIndex: true,
});

function MfaVerifyFallback() {
  return (
    <div className="flex h-96 w-full max-w-md items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function MfaVerifyPage() {
  return (
    <Suspense fallback={<MfaVerifyFallback />}>
      <MfaVerifyForm />
    </Suspense>
  );
}
