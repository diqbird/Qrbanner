'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Lock, LogOut, Save, Palette, LifeBuoy } from 'lucide-react';
import { ThemeModeSwitch } from '@/components/theme-mode-switch';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { MfaSettings } from '@/components/dashboard/mfa-settings';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import type { SettingsAccountState } from '@/hooks/use-settings-account';

type SettingsAccountTabProps = {
  account: SettingsAccountState;
};

export function SettingsAccountTab({ account }: SettingsAccountTabProps) {
  const {
    t,
    session,
    name,
    setName,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    saving,
    handleUpdateProfile,
    handleChangePassword,
  } = account;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-display">{t('settings.preferences')}</CardTitle>
          <CardDescription>{t('settings.preferencesDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t('dashboard.language')}</Label>
            <p className="text-xs text-muted-foreground">{t('dashboard.languageDesc')}</p>
            <LanguageSwitcher />
          </div>
          <div className="space-y-2 border-t border-border/50 pt-6">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" /> {t('settings.appearance')}
            </Label>
            <p className="text-xs text-muted-foreground">{t('settings.appearanceDesc')}</p>
            <ThemeModeSwitch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> {t('settings.profile')}
          </CardTitle>
          <CardDescription>{t('settings.profileDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('common.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={session?.user?.email ?? ''} disabled className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('common.name')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" loading={saving} className="gap-2">
              <Save className="h-4 w-4" /> {t('settings.saveChanges')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> {t('settings.changePassword')}
          </CardTitle>
          <CardDescription>{t('settings.changePasswordDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('settings.currentPassword')}</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.newPassword')}</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <Button type="submit" loading={saving} className="gap-2">
              <Lock className="h-4 w-4" /> {t('settings.changePassword')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <MfaSettings />

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
