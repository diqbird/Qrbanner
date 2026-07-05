'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Lock, Save } from 'lucide-react';
import type { SettingsAccountState } from '@/hooks/use-settings-account';

export function SettingsAccountProfileCard({ account }: { account: SettingsAccountState }) {
  const { t, session, name, setName, saving, handleUpdateProfile } = account;

  return (
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
              <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
            </div>
          </div>
          <Button type="submit" loading={saving} className="gap-2">
            <Save className="h-4 w-4" /> {t('settings.saveChanges')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function SettingsAccountPasswordCard({ account }: { account: SettingsAccountState }) {
  const {
    t,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    saving,
    handleChangePassword,
  } = account;

  return (
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
  );
}
