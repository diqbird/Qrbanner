'use client';

import Link from 'next/link';
import type { OAuthProviderId } from '@/lib/auth-providers';
import { OAuthButtons } from './oauth-buttons';
import { ReferralSignupBanner } from './referral-signup-banner';
import { ReferralCookieSync } from './referral-cookie-sync';
import { AuthFormShell } from './auth-form-shell';
import { useSignupForm } from '@/hooks/use-signup-form';
import { SignupFormFields } from './signup-form-fields';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatFreePlanReferralQrLabel } from '@/lib/i18n/dynamic-qr-label';
import { useInviteAuthBrand } from '@/hooks/use-invite-auth-brand';

export function SignupForm({ oauthProviders = [] }: { oauthProviders?: OAuthProviderId[] }) {
  const form = useSignupForm();
  const { locale } = useLanguage();
  const { t, callbackUrl } = form;
  const qrLabel = formatFreePlanReferralQrLabel(locale);
  const inviteBrand = useInviteAuthBrand(callbackUrl);
  const brandName = inviteBrand?.agencyName?.trim();
  const workspaceName = inviteBrand?.workspaceName?.trim();
  const subtitle =
    brandName && workspaceName
      ? t('auth.inviteSignUpSubtitle', { workspace: workspaceName, brand: brandName })
      : t('auth.createAccountSubtitle', { qrLabel });

  return (
    <AuthFormShell
      title={t('auth.createAccount')}
      subtitle={subtitle}
      homeAria={t('common.homeAria')}
      inviteBrand={inviteBrand}
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
