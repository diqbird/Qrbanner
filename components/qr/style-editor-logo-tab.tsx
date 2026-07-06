'use client';

import { Label } from '@/components/ui/label';
import { Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { StyleEditorTabProps } from './style-editor-tab-props';

type StyleEditorLogoTabProps = StyleEditorTabProps & {
  logoPreview: string | null;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function StyleEditorLogoTab({
  style: s,
  update,
  logoPreview,
  onLogoChange,
}: StyleEditorLogoTabProps) {
  const { t } = useLanguage();
  const logoPercent = Math.round((s.logoSize ?? 0.22) * 100);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" /> {t('style.logoOverlay')}
        </Label>
        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <ImageIcon className="h-4 w-4" />
            {logoPreview ? t('style.changeLogo') : t('style.uploadLogo')}
            <input type="file" accept="image/*" onChange={onLogoChange} className="hidden" />
          </label>
          {logoPreview && (
            <div className="relative h-14 w-14 overflow-hidden rounded-lg border">
              <img src={logoPreview} alt="" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{t('style.logoHint')}</p>
        <div className="space-y-2">
          <Label className="text-xs">{t('style.logoSize', { percent: logoPercent })}</Label>
          <input
            type="range"
            min={0.1}
            max={0.35}
            step={0.01}
            value={s.logoSize ?? 0.22}
            onChange={(e) => update({ logoSize: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
        {logoPreview && s.errorCorrection !== 'H' && (
          <button
            type="button"
            onClick={() => update({ errorCorrection: 'H' })}
            className="text-xs text-primary hover:underline"
          >
            {t('style.switchToH')}
          </button>
        )}
      </div>
    </div>
  );
}
