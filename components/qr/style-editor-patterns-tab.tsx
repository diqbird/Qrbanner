'use client';

import { Label } from '@/components/ui/label';
import { DOT_STYLES, CORNER_STYLES, ERROR_LEVELS } from '@/lib/qr-style';
import { StyleEditorDotPreview } from './style-editor-dot-preview';
import { useLanguage } from '@/components/i18n/language-provider';
import type { StyleEditorTabProps } from './style-editor-tab-props';

export function StyleEditorPatternsTab({ style: s, update }: StyleEditorTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Dot Style</Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {DOT_STYLES.map((ds) => (
            <button
              key={ds.id}
              type="button"
              onClick={() => update({ dotStyle: ds.id })}
              className="flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all hover:border-primary/50"
            >
              <StyleEditorDotPreview type={ds.id} active={s.dotStyle === ds.id} />
              <span className="text-center text-[10px] font-medium leading-tight">{ds.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Corner Square Style</Label>
        <div className="flex flex-wrap gap-2">
          {CORNER_STYLES.map((cs) => (
            <button
              key={cs.id}
              type="button"
              onClick={() => update({ cornerStyle: cs.id })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                s.cornerStyle === cs.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {cs.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Corner Dot Style</Label>
        <div className="flex flex-wrap gap-2">
          {CORNER_STYLES.map((cs) => (
            <button
              key={cs.id}
              type="button"
              onClick={() => update({ cornerDotStyle: cs.id })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                s.cornerDotStyle === cs.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {cs.label}
            </button>
          ))}
        </div>
      </div>

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
    </div>
  );
}
