'use client';

import { Button } from '@/components/ui/button';
import type { LoginFormState } from '@/hooks/use-login-form';

type LoginFormSsoButtonsProps = {
  login: LoginFormState;
};

export function LoginFormSsoButtons({ login }: LoginFormSsoButtonsProps) {
  const { t, samlInfo, ssoPolicy } = login;

  return (
    <>
      {samlInfo?.enabled && samlInfo.loginUrl && (
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.href = samlInfo.loginUrl!;
            }}
          >
            {t('settings.team.signInWithSaml')}
            {samlInfo.name ? ` (${samlInfo.name})` : ''}
          </Button>
        </div>
      )}

      {ssoPolicy?.samlWorkspaces.map((ws) => (
        <div key={ws.slug} className="mt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.href = ws.loginUrl;
            }}
          >
            {t('settings.team.signInWithSaml')}
            {ws.name ? ` (${ws.name})` : ''}
          </Button>
        </div>
      ))}
    </>
  );
}
