'use client';

import { Label } from '@/components/ui/label';
import { ERROR_LEVELS } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import type { StyleEditorTabProps } from './style-editor-tab-props';

export function StyleEditorErrorMarginSection({ style: s, update }: StyleEditorTabProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="space-y-2">
        <Label>Error Correction</Label>
        <div className="flex gap-2">
          {ERROR_LEVELS.map((ec) => (
            <button
              key={ec}
              type="button"
              onClick={() => update({ errorCorrection: ec })}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                s.errorCorrection === ec
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {ec}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Use H when adding a logo. Higher levels tolerate more damage before becoming unreadable.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{t('style.quietZone')}</Label>
          <span className="font-mono text-xs text-muted-foreground">{s.margin}</span>
        </div>
        <input
          type="range"
          min={0}
          max={20}
          step={1}
          value={s.margin}
          onChange={(e) => update({ margin: parseInt(e.target.value, 10) })}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          White space around the QR pattern. Increase for print or busy backgrounds (4–8 recommended).
        </p>
      </div>
    </>
  );
}
