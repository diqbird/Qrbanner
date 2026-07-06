'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Frame } from 'lucide-react';
import { FRAME_STYLES } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import type { StyleEditorTabProps } from './style-editor-tab-props';

export function StyleEditorFrameTab({ style: s, update }: StyleEditorTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Frame className="h-4 w-4" /> {t('style.frameStyle')}
        </Label>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {FRAME_STYLES.map((fs) => (
            <button
              key={fs.id}
              type="button"
              onClick={() => update({ frameStyle: fs.id })}
              className={`rounded-lg border p-3 text-left transition-all ${
                s.frameStyle === fs.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="text-sm font-medium">{t(`style.frameStyles.${fs.id}`)}</p>
              <p className="text-xs text-muted-foreground">{t(`style.frameDescriptions.${fs.id}`)}</p>
            </button>
          ))}
        </div>
      </div>

      {s.frameStyle !== 'none' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t('style.frameColor')}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={s.frameColor}
                onChange={(e) => update({ frameColor: e.target.value })}
                className="h-10 w-10 cursor-pointer rounded border-0"
              />
              <Input
                value={s.frameColor}
                onChange={(e) => update({ frameColor: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('style.frameTextColor')}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={s.frameTextColor}
                onChange={(e) => update({ frameTextColor: e.target.value })}
                className="h-10 w-10 cursor-pointer rounded border-0"
              />
              <Input
                value={s.frameTextColor}
                onChange={(e) => update({ frameTextColor: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
