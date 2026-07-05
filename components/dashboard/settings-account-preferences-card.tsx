'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';
import { ThemeModeSwitch } from '@/components/theme-mode-switch';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import type { SettingsAccountState } from '@/hooks/use-settings-account';

export function SettingsAccountPreferencesCard({ account }: { account: SettingsAccountState }) {
  const { t } = account;

  return (
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
  );
}
