'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { BrandingForm } from '@/lib/branding-settings-utils';

export function BrandingSettingsForm({
  form,
  setForm,
  saving,
  onSave,
  t,
}: {
  form: BrandingForm;
  setForm: React.Dispatch<React.SetStateAction<BrandingForm | null>>;
  saving: boolean;
  onSave: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="space-y-4">
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
        <Label>{t('referral.logoUrl')}</Label>
        <Input
          type="url"
          value={form.logoUrl}
          onChange={(e) => setForm((prev) => (prev ? { ...prev, logoUrl: e.target.value } : prev))}
          placeholder={t('referral.logoUrlPlaceholder')}
        />
        <p className="text-xs text-muted-foreground">{t('referral.logoUrlDesc')}</p>
      </div>
      <div className="space-y-2">
        <Label>{t('referral.brandColor')}</Label>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(form.brandColor) ? form.brandColor : '#4f46e5'}
            onChange={(e) => setForm((prev) => (prev ? { ...prev, brandColor: e.target.value } : prev))}
            className="h-10 w-14 cursor-pointer p-1"
            aria-label={t('referral.brandColor')}
          />
          <Input
            value={form.brandColor}
            onChange={(e) => setForm((prev) => (prev ? { ...prev, brandColor: e.target.value } : prev))}
            placeholder={t('referral.brandColorPlaceholder')}
            className="max-w-[140px] font-mono text-sm"
          />
        </div>
        <p className="text-xs text-muted-foreground">{t('referral.brandColorDesc')}</p>
      </div>
      <div className="space-y-2">
        <Label>{t('referral.supportEmail')}</Label>
        <Input
          type="email"
          value={form.supportEmail}
          onChange={(e) => setForm((prev) => (prev ? { ...prev, supportEmail: e.target.value } : prev))}
          placeholder={t('referral.supportEmailPlaceholder')}
        />
      </div>
      <Button onClick={onSave} loading={saving}>
        {t('referral.saveBranding')}
      </Button>
    </div>
  );
}
