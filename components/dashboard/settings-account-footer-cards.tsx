'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, LogOut, LifeBuoy } from 'lucide-react';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import type { SettingsAccountState } from '@/hooks/use-settings-account';

export function SettingsAccountFooterCards({ account }: { account: SettingsAccountState }) {
  const { t } = account;

  return (
    <>
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="font-medium flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-primary" /> {t('dashboard.helpSupport')}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{t('dashboard.helpSupportDesc')}</p>
          </div>
          <a href={supportMailto('QRbanner Account Help')}>
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" /> {SUPPORT_EMAIL}
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="font-medium">{t('common.signOut')}</h3>
            <p className="text-sm text-muted-foreground">{t('settings.signOutDesc')}</p>
          </div>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })} className="gap-2">
            <LogOut className="h-4 w-4" /> {t('common.signOut')}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
