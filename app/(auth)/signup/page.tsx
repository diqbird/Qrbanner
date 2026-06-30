import { Suspense } from 'react';
import { SignupForm } from '@/components/auth/signup-form';
import { getOAuthProviderIds } from '@/lib/auth-providers';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Sign Up',
  description: 'Create your free QRbanner account and start generating dynamic QR codes with tracking.',
  path: '/signup',
  noIndex: true,
});

function SignupFormFallback() {
  return (
    <div className="flex h-96 w-full max-w-md items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function SignupPage() {
  const oauthProviders = getOAuthProviderIds();

  return (
    <Suspense fallback={<SignupFormFallback />}>
      <SignupForm oauthProviders={oauthProviders} />
    </Suspense>
  );
}
