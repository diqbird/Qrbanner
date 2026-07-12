'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import type { OAuthProviderId } from '@/lib/auth-providers';
import { OAuthButtons } from './oauth-buttons';
import { ReferralCookieSync } from './referral-cookie-sync';
import { AuthFormShell } from './auth-form-shell';
import { useLoginForm } from '@/hooks/use-login-form';
import { LoginFormCredentials } from './login-form-credentials';
import { LoginFormSsoButtons } from './login-form-sso-buttons';
import { useInviteAuthBrand } from '@/hooks/use-invite-auth-brand';

export function LoginForm({ oauthProviders = [] }: { oauthProviders?: OAuthProviderId[] }) {
  const login = useLoginForm();
  const {
    t,
    callbackUrl,
    email,
    setEmail,
    ssoPolicy,
    passwordAllowed,
    checkSsoPolicy,
  } = login;
  const inviteBrand = useInviteAuthBrand(callbackUrl);
  const brandName = inviteBrand?.agencyName?.trim();
  const workspaceName = inviteBrand?.workspaceName?.trim();
  const subtitle =
    brandName && workspaceName
      ? t('auth.inviteSignInSubtitle', { workspace: workspaceName, brand: brandName })
      : t('auth.signInSubtitle');

  const visibleOAuthProviders = (oauthProviders as OAuthProviderId[]).filter((provider) => {
    if (!ssoPolicy?.required) return true;
    return ssoPolicy.oauthProviders.includes(provider);
  });

  return (
    <AuthFormShell
      title={t('auth.welcomeBack')}
      subtitle={subtitle}
      homeAria={t('common.homeAria')}
      inviteBrand={inviteBrand}
      beforeContent={<ReferralCookieSync />}
      footer={
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link
            href={
              callbackUrl !== '/dashboard'
                ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : '/signup'
            }
            className="font-medium text-primary hover:underline"
          >
            {t('auth.signUpFree')}
          </Link>
        </p>
      }
    >
      {ssoPolicy?.required && (
        <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          {t('auth.errors.sso_required')}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <Label htmlFor="email">{t('common.email')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={t('common.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => checkSsoPolicy(e.target.value)}
            required
            className="pl-10"
            autoComplete="email"
          />
        </div>
      </div>

      {passwordAllowed ? <LoginFormCredentials login={login} /> : null}
      <OAuthButtons providers={visibleOAuthProviders} callbackUrl={callbackUrl} />
      <LoginFormSsoButtons login={login} />
    </AuthFormShell>
  );
}
