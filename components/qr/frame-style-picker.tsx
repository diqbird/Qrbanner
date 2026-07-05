'use client';

import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/i18n/language-provider';
import { patchFrameText, FRAME_STYLES, FRAME_TEXT_PRESETS, type QRStyleConfig } from '@/lib/qr-style';

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
