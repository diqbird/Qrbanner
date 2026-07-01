'use client';



import { Label } from '@/components/ui/label';

import { Input } from '@/components/ui/input';

import { useShowQrDescription } from '@/components/site-settings-provider';
import { FRAME_STYLES, FRAME_TEXT_PRESETS, clearFrameLabel, patchFrameText, type QRStyleConfig } from '@/lib/qr-style';

import { useLanguage } from '@/components/i18n/language-provider';



export function FrameLabelSettings({

  style,

  onChange,

  compact = false,

  inlineEdit = false,

}: {

  style: QRStyleConfig;

  onChange: (patch: Partial<QRStyleConfig>) => void;

  compact?: boolean;

  /** When true, text is edited on the QR preview — hide duplicate input */

  inlineEdit?: boolean;

}) {

  const { t } = useLanguage();
  const showQrDescription = useShowQrDescription();
  const hasFrame = style.frameStyle !== 'none';

  if (!showQrDescription) {
    return null;
  }

  const setLabel = (text: string) => {

    onChange(patchFrameText(style, text));

  };



  return (

    <div

      className={`w-full rounded-lg border border-primary/20 bg-primary/5 ${

        compact ? 'space-y-2 p-3' : 'space-y-4 p-4'

      }`}

    >

      {inlineEdit ? (

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

      ) : (

        <div className="space-y-2">

          <Label htmlFor="frame-label-input">{t('style.frameLabel')}</Label>

          <Input

            id="frame-label-input"

            value={style.frameText}

            onChange={(e) => setLabel(e.target.value)}

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

      )}



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

    </div>

  );

}

