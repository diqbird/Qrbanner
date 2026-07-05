'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/i18n/language-provider';
import { clearFrameLabel, patchFrameText, type QRStyleConfig } from '@/lib/qr-style';

type FrameLabelInputProps = {
  style: QRStyleConfig;
  onChange: (patch: Partial<QRStyleConfig>) => void;
  hasFrame: boolean;
  inlineEdit?: boolean;
};

export function FrameLabelInput({ style, onChange, hasFrame, inlineEdit }: FrameLabelInputProps) {
  const { t } = useLanguage();

  if (inlineEdit) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{t('style.frameLabelEditHint')}</p>
        {hasFrame && (
          <button
            type="button"
            onClick={() => onChange(clearFrameLabel())}
            className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors shrink-0"
          >
            {t('style.frameLabelRemove')}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="frame-label-input">{t('style.frameLabel')}</Label>
      <Input
        id="frame-label-input"
        value={style.frameText}
        onChange={(e) => onChange(patchFrameText(style, e.target.value))}
        onBlur={(e) => {
          if (!e.target.value.trim()) onChange(clearFrameLabel());
        }}
        placeholder={t('style.frameLabelPlaceholder')}
        maxLength={32}
      />
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs text-muted-foreground flex-1 min-w-[12rem]">{t('style.frameLabelHint')}</p>
        {hasFrame && (
          <button
            type="button"
            onClick={() => onChange(clearFrameLabel())}
            className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
          >
            {t('style.frameLabelRemove')}
          </button>
        )}
      </div>
    </div>
  );
}
