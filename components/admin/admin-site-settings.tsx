'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { useSiteSettings } from '@/components/site-settings-provider';

export function AdminSiteSettings() {
  const { t } = useLanguage();
  const { refresh } = useSiteSettings();
  const [showQrDescription, setShowQrDescription] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-settings');
      if (res.ok) {
        const data = await res.json();
        setShowQrDescription(data.showQrDescription !== false);
      }
    } catch {
      toast.error(t('admin.settingsLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const onToggle = async (checked: boolean) => {
    setSaving(true);
    setShowQrDescription(checked);
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showQrDescription: checked }),
      });
      if (!res.ok) {
        setShowQrDescription(!checked);
        toast.error(t('admin.settingsSaveFailed'));
        return;
      }
      await refresh();
      toast.success(t('admin.settingsSaved'));
    } catch {
      setShowQrDescription(!checked);
      toast.error(t('admin.settingsSaveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Settings2 className="h-5 w-5" /> {t('admin.siteSettingsTitle')}
        </CardTitle>
        <CardDescription>{t('admin.siteSettingsSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 px-4 py-3">
          <div className="space-y-0.5">
            <Label htmlFor="show-qr-description" className="text-sm font-medium">
              {t('admin.showQrDescription')}
            </Label>
            <p className="text-xs text-muted-foreground">{t('admin.showQrDescriptionHint')}</p>
          </div>
          <Switch
            id="show-qr-description"
            checked={showQrDescription}
            disabled={loading || saving}
            onCheckedChange={onToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
}
