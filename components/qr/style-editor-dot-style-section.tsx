'use client';

import { Label } from '@/components/ui/label';
import { DOT_STYLES } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import { StyleEditorDotPreview } from './style-editor-dot-preview';
import type { StyleEditorTabProps } from './style-editor-tab-props';

export function StyleEditorDotStyleSection({ style: s, update }: StyleEditorTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label>{t('style.dotStyle')}</Label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {DOT_STYLES.map((ds) => (
          <button
            key={ds.id}
            type="button"
            onClick={() => update({ dotStyle: ds.id })}
            className="flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all hover:border-primary/50"
          >
            <StyleEditorDotPreview type={ds.id} active={s.dotStyle === ds.id} />
            <span className="text-center text-[10px] font-medium leading-tight">
              {t(`style.dotStyles.${ds.id}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
