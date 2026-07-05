'use client';

import Link from 'next/link';
import type { OAuthProviderId } from '@/lib/auth-providers';
import { OAuthButtons } from './oauth-buttons';
import { ReferralSignupBanner } from './referral-signup-banner';
import { ReferralCookieSync } from './referral-cookie-sync';
import { AuthFormShell } from './auth-form-shell';
import { useSignupForm } from '@/hooks/use-signup-form';
import { SignupFormFields } from './signup-form-fields';

export function SignupForm({ oauthProviders = [] }: { oauthProviders?: OAuthProviderId[] }) {
  const form = useSignupForm();
  const { t, callbackUrl } = form;

  return (
    <AuthFormShell
      title={t('auth.createAccount')}
      subtitle={t('auth.createAccountSubtitle')}
      homeAria={t('common.homeAria')}
      beforeContent={
        <>
          <ReferralCookieSync />
          <ReferralSignupBanner />
        </>
      }
      footer={
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('auth.hasAccount')}{' '}
          <Link
            href={
              callbackUrl !== '/dashboard'
                ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : '/login'
            }
            className="font-medium text-primary hover:underline"
          >
            {t('common.signIn')}
          </Link>
        </p>
      }
    >
      <SignupFormFields form={form} />
      <OAuthButtons providers={oauthProviders} callbackUrl={callbackUrl} dividerLabel={t('auth.orSignUpWith')} />
    </AuthFormShell>
  );
}
