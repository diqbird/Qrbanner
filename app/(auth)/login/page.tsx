import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { getOAuthProviderIds } from '@/lib/auth-providers';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Sign In',
  description: 'Sign in to your QRbanner account to manage QR codes and view analytics.',
  path: '/login',
  noIndex: true,
});

function LoginFormFallback() {
  return (
    <div className="flex h-96 w-full max-w-md items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function LoginPage() {
  const oauthProviders = getOAuthProviderIds();

  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm oauthProviders={oauthProviders} />
    </Suspense>
  );
}
