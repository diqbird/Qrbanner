'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/i18n/language-provider';
import { clearFrameLabel, patchFrameText, FRAME_STYLES, FRAME_TEXT_PRESETS, type QRStyleConfig } from '@/lib/qr-style';

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

export function FrameStylePicker({
  style,
  onChange,
  hasFrame,
  compact,
}: {
  style: QRStyleConfig;
  onChange: (patch: Partial<QRStyleConfig>) => void;
  hasFrame: boolean;
  compact?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">{t('style.frameStyle')}</Label>
        <div className="flex flex-wrap gap-1.5">
          {FRAME_STYLES.map((fs) => (
            <button
              key={fs.id}
              type="button"
              onClick={() => onChange({ frameStyle: fs.id })}
              className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                style.frameStyle === fs.id
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {t(`style.frameStyles.${fs.id}`)}
            </button>
          ))}
        </div>
        {!hasFrame && (
          <p className="text-xs text-amber-700 dark:text-amber-300">{t('style.frameNoneHint')}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('style.frameQuickLabels')}</Label>
        <div className="flex flex-wrap gap-1.5">
          {FRAME_TEXT_PRESETS.slice(0, compact ? 6 : undefined).map((preset) => (
            <button
              key={preset.text}
              type="button"
              onClick={() => onChange(patchFrameText(style, preset.text))}
              className={`rounded-full border px-2 py-0.5 text-xs transition-colors ${
                style.frameText === preset.text
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
