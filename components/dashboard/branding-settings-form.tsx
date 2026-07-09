'use client';

import { useState } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { mediaPickerFullUrl } from '@/hooks/use-media-picker-assets';
import type { BrandingForm } from '@/lib/branding-settings-utils';

function BrandAssetField({
  label,
  desc,
  value,
  placeholder,
  onChange,
  onClear,
  onPick,
  pickLabel,
  clearLabel,
  previewAlt,
}: {
  label: string;
  desc: string;
  value: string;
  placeholder: string;
  onChange: (url: string) => void;
  onClear: () => void;
  onPick: () => void;
  pickLabel: string;
  clearLabel: string;
  previewAlt: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-start gap-3">
        {value ? (
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={previewAlt} className="max-h-full max-w-full object-contain" />
          </div>
        ) : null}
        <div className="min-w-0 flex-1 space-y-2">
          <Input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={onPick}>
              <ImageIcon className="h-3.5 w-3.5" aria-hidden />
              {pickLabel}
            </Button>
            {value ? (
              <Button type="button" variant="ghost" size="sm" className="gap-1.5" onClick={onClear}>
                <X className="h-3.5 w-3.5" aria-hidden />
                {clearLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

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
  const [pickerTarget, setPickerTarget] = useState<'logo' | 'favicon' | null>(null);

  const applyPickedUrl = (url: string) => {
    const full = mediaPickerFullUrl(url);
    if (pickerTarget === 'logo') {
      setForm((prev) => (prev ? { ...prev, logoUrl: full } : prev));
    } else if (pickerTarget === 'favicon') {
      setForm((prev) => (prev ? { ...prev, faviconUrl: full } : prev));
    }
    setPickerTarget(null);
  };

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

      <BrandAssetField
        label={t('referral.logoUrl')}
        desc={t('referral.logoUrlDesc')}
        value={form.logoUrl}
        placeholder={t('referral.logoUrlPlaceholder')}
        onChange={(logoUrl) => setForm((prev) => (prev ? { ...prev, logoUrl } : prev))}
        onClear={() => setForm((prev) => (prev ? { ...prev, logoUrl: '' } : prev))}
        onPick={() => setPickerTarget('logo')}
        pickLabel={t('referral.pickFromLibrary')}
        clearLabel={t('referral.clearAsset')}
        previewAlt={t('referral.logoPreviewAlt')}
      />

      <BrandAssetField
        label={t('referral.faviconUrl')}
        desc={t('referral.faviconUrlDesc')}
        value={form.faviconUrl}
        placeholder={t('referral.faviconUrlPlaceholder')}
        onChange={(faviconUrl) => setForm((prev) => (prev ? { ...prev, faviconUrl } : prev))}
        onClear={() => setForm((prev) => (prev ? { ...prev, faviconUrl: '' } : prev))}
        onPick={() => setPickerTarget('favicon')}
        pickLabel={t('referral.pickFromLibrary')}
        clearLabel={t('referral.clearAsset')}
        previewAlt={t('referral.faviconPreviewAlt')}
      />

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

      <MediaPickerDialog
        open={pickerTarget !== null}
        onOpenChange={(open) => {
          if (!open) setPickerTarget(null);
        }}
        onSelect={applyPickedUrl}
        titleKey="referral.pickFromLibrary"
      />
    </div>
  );
}
