'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { useSettingsResource } from '@/hooks/use-settings-resource';

type BrandingForm = {
  hidePoweredBy: boolean;
  agencyName: string;
  supportEmail: string;
};

function parseBranding(json: unknown): BrandingForm {
  const data = json as { branding?: Record<string, unknown> };
  const b = data.branding ?? {};
  return {
    hidePoweredBy: Boolean(b.hidePoweredBy),
    agencyName: String(b.agencyName ?? ''),
    supportEmail: String(b.supportEmail ?? ''),
  };
}

export function BrandingSettings() {
  const { t } = useLanguage();
  const { data, loading, saving, save } = useSettingsResource({
    url: '/api/referral',
    parse: parseBranding,
  });
  const [form, setForm] = useState<BrandingForm | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const saveBranding = async () => {
    if (!form) return;
    const result = await save({ body: form });
    if (!result.ok) {
      toast.error((result.json as { error?: string })?.error ?? t('settings.profileUpdateFailed'));
      return;
    }
    toast.success(t('referral.brandingSaved'));
  };

  if (loading || !form) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          {t('referral.brandingTitle')}
        </CardTitle>
        <CardDescription>{t('referral.brandingDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label>{t('referral.hidePoweredBy')}</Label>
            <p className="text-xs text-muted-foreground">{t('referral.hidePoweredByDesc')}</p>
          </div>
          <Switch
            checked={form.hidePoweredBy}
            onCheckedChange={(hidePoweredBy) => setForm((prev) => (prev ? { ...prev, hidePoweredBy } : prev))}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('referral.agencyName')}</Label>
          <Input
            value={form.agencyName}
            onChange={(e) => setForm((prev) => (prev ? { ...prev, agencyName: e.target.value } : prev))}
            placeholder={t('referral.agencyNamePlaceholder')}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('referral.supportEmail')}</Label>
          <Input
            type="email"
            value={form.supportEmail}
            onChange={(e) => setForm((prev) => (prev ? { ...prev, supportEmail: e.target.value } : prev))}
            placeholder="support@youragency.com"
          />
        </div>
        <Button onClick={saveBranding} loading={saving}>
          {t('referral.saveBranding')}
        </Button>
      </CardContent>
    </Card>
  );
}
