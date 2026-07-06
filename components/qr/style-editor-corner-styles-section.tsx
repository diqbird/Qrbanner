'use client';

import { Label } from '@/components/ui/label';
import { CORNER_STYLES } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import type { StyleEditorTabProps } from './style-editor-tab-props';

export function StyleEditorCornerStylesSection({ style: s, update }: StyleEditorTabProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="space-y-2">
        <Label>{t('style.cornerSquareStyle')}</Label>
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
              {t(`style.cornerStyles.${cs.id}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('style.cornerDotStyle')}</Label>
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
              {t(`style.cornerStyles.${cs.id}`)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
