'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { parseBranding, type BrandingForm } from '@/lib/branding-settings-utils';
import { BrandingSettingsForm } from './branding-settings-form';

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
      <CardContent>
        <BrandingSettingsForm form={form} setForm={setForm} saving={saving} onSave={saveBranding} t={t} />
      </CardContent>
    </Card>
  );
}
