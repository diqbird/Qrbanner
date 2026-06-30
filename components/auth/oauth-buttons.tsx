'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import type { OAuthProviderId } from '@/lib/auth-providers';
import { useLanguage } from '@/components/i18n/language-provider';

const OAUTH_KEYS: Record<OAuthProviderId, string> = {
  google: 'auth.continueGoogle',
  github: 'auth.continueGithub',
  'azure-ad': 'auth.continueMicrosoft',
};

export function OAuthButtons({
  providers,
  callbackUrl = '/dashboard',
  dividerLabel,
}: {
  providers: OAuthProviderId[];
  callbackUrl?: string;
  dividerLabel?: string;
}) {
  const { t } = useLanguage();
  if (providers.length === 0) return null;

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            {dividerLabel ?? t('auth.orSignInWith')}
          </span>
        </div>
      </div>

      <div className="grid gap-2">
        {providers.map((provider) => (
          <Button
            key={provider}
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn(provider, { callbackUrl })}
          >
            {t(OAUTH_KEYS[provider])}
          </Button>
        ))}
      </div>
    </>
  );
}
