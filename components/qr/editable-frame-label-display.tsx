'use client';

import { Pencil, X } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { QRStyleConfig } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';

export function EditableFrameLabelDisplay({
  style,
  displayText,
  onRemove,
}: {
  style: QRStyleConfig;
  displayText: string;
  onRemove: (e: MouseEvent) => void;
}) {
  const { t } = useLanguage();

  return (
    <span
      className="group flex max-w-full items-center justify-center gap-1 truncate text-center font-bold"
      style={{ color: style.frameTextColor, fontSize: 'clamp(10px, 2.5vw, 15px)' }}
    >
      <span className="truncate">{displayText}</span>
      <Pencil className="h-3 w-3 shrink-0 opacity-60 group-hover:opacity-100" aria-hidden />
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 shrink-0 rounded p-0.5 opacity-60 hover:bg-black/10 hover:opacity-100 dark:hover:bg-white/10"
        aria-label={t('style.frameLabelRemove')}
        title={t('style.frameLabelRemove')}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
