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
        <Label>{t('referral.supportEmail')}</Label>
        <Input
          type="email"
          value={form.supportEmail}
          onChange={(e) => setForm((prev) => (prev ? { ...prev, supportEmail: e.target.value } : prev))}
          placeholder="support@youragency.com"
        />
      </div>
      <Button onClick={onSave} loading={saving}>
        {t('referral.saveBranding')}
      </Button>
    </div>
  );
}
