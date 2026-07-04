'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Lock, LogOut, Save, Palette, LifeBuoy } from 'lucide-react';
import { ThemeModeSwitch } from '@/components/theme-mode-switch';
import { ApiKeySettings } from '@/components/dashboard/api-key-settings';
import { TeamWorkspaceSettings } from '@/components/dashboard/team-workspace-settings';
import { EnterpriseWorkspaceSettings } from '@/components/dashboard/enterprise-workspace-settings';
import { WebhookSettings } from '@/components/dashboard/webhook-settings';
import { AutomationBuilder } from '@/components/dashboard/automation-builder';
import { CustomDomainSettings } from '@/components/dashboard/custom-domain-settings';
import { PlanUsageCard } from '@/components/dashboard/plan-usage-card';
import { MediaLibraryCard } from '@/components/dashboard/media-library-card';
import { toast } from 'sonner';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { ReferralSettings } from '@/components/dashboard/referral-settings';
import { BrandingSettings } from '@/components/dashboard/branding-settings';
import { BrandKitHub } from '@/components/dashboard/brand-kit-hub';
import { MfaSettings } from '@/components/dashboard/mfa-settings';
import { MarketplaceSellerPanel } from '@/components/dashboard/marketplace-seller-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function SettingsSection({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-t border-border/50 pt-6 first:border-0 first:pt-0">
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function SettingsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession() || {};
  const [planRefresh, setPlanRefresh] = useState(0);
  const [name, setName] = useState(session?.user?.name ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const settingsTab = searchParams.get('tab') ?? 'account';

  useEffect(() => {
    const sessionName = session?.user?.name;
    if (sessionName != null) setName(sessionName);
  }, [session?.user?.name]);

  useEffect(() => {
    if (searchParams.get('billing') !== 'success') return;
    if (searchParams.get('_ptxn')) return;
    toast.success(t('pricing.billingSuccess'));
    setPlanRefresh((k) => k + 1);
    router.replace('/settings?tab=plan');
    let attempts = 0;
    const poll = window.setInterval(() => {
      attempts += 1;
      setPlanRefresh((k) => k + 1);
      if (attempts >= 5) window.clearInterval(poll);
    }, 2500);
    return () => window.clearInterval(poll);
  }, [searchParams, router, t]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        toast.success(t('settings.profileUpdated'));
      } else {
        toast.error(t('settings.profileUpdateFailed'));
      }
    } catch {
      toast.error(t('bulk.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error(t('settings.fillAllFields'));
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        toast.success(t('settings.passwordChanged'));
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const data = await res.json();
        toast.error(resolveApiError(t, data?.error, 'settings.passwordChangeFailed'));
      }
    } catch {
      toast.error(t('bulk.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{t('dashboard.settings')}</h1>
        <p className="mt-1 text-muted-foreground">{t('settings.subtitle')}</p>
      </div>

      <Tabs
        value={settingsTab}
        onValueChange={(value) => router.replace(`/settings?tab=${value}`, { scroll: false })}
        className="space-y-6"
      >
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="account">{t('settings.tabAccount')}</TabsTrigger>
          <TabsTrigger value="plan">{t('settings.tabPlan')}</TabsTrigger>
          <TabsTrigger value="team">{t('settings.tabTeam')}</TabsTrigger>
          <TabsTrigger value="integrations">{t('settings.tabIntegrations')}</TabsTrigger>
          <TabsTrigger value="brand">{t('settings.tabBrand')}</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6 mt-0">
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.newPassword')}</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              />
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
            <p className="text-sm text-muted-foreground mt-1">
              {t('dashboard.helpSupportDesc')}
            </p>
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
        </TabsContent>

        <TabsContent value="plan" className="space-y-6 mt-0">
      <PlanUsageCard refreshKey={planRefresh} />
        </TabsContent>

        <TabsContent value="team" className="space-y-6 mt-0">
      <TeamWorkspaceSettings />
      <EnterpriseWorkspaceSettings />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6 mt-0">
      <SettingsSection title={t('settings.sectionApi')} description={t('settings.sectionApiDesc')} />
      <ApiKeySettings />
      <WebhookSettings />
      <SettingsSection title={t('settings.sectionAutomation')} description={t('settings.sectionAutomationDesc')} />
      <AutomationBuilder />
      <SettingsSection title={t('settings.sectionDomain')} description={t('settings.sectionDomainDesc')} />
      <CustomDomainSettings />
        </TabsContent>

        <TabsContent value="brand" className="space-y-6 mt-0">
      <SettingsSection title={t('settings.sectionBrandKit')} description={t('settings.sectionBrandKitDesc')} />
      <BrandKitHub />
      <BrandingSettings />
      <MediaLibraryCard />
      <SettingsSection title={t('settings.sectionGrowth')} description={t('settings.sectionGrowthDesc')} />
      <ReferralSettings />
      <MarketplaceSellerPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
