'use client';

import { Pencil } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

export function EditableFrameLabelEmpty({ onStartEdit }: { onStartEdit: () => void }) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onStartEdit}
      className="absolute -bottom-1 left-1/2 z-10 flex w-[min(100%,260px)] max-w-[calc(100%-0.5rem)] -translate-x-1/2 translate-y-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-3 py-2 text-center text-xs font-medium leading-snug text-primary whitespace-normal hover:border-primary hover:bg-primary/10 transition-colors"
    >
      <Pencil className="h-3 w-3 shrink-0" />
      {t('style.frameLabelClickToAdd')}
    </button>
  );
}
