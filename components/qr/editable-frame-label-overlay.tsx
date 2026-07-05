'use client';

import { Pencil, X } from 'lucide-react';
import { getFrameLabelRect, type QRStyleConfig } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import { cn } from '@/lib/utils';
import type { MouseEvent, RefObject } from 'react';

type EditableFrameLabelOverlayProps = {
  style: QRStyleConfig;
  displayText: string;
  editing: boolean;
  draft: string;
  setDraft: (v: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  onStartEdit: () => void;
  onCommit: () => void;
  onCancel: () => void;
  onRemove: (e: MouseEvent) => void;
};

export function EditableFrameLabelOverlay({
  style,
  displayText,
  editing,
  draft,
  setDraft,
  inputRef,
  onStartEdit,
  onCommit,
  onCancel,
  onRemove,
}: EditableFrameLabelOverlayProps) {
  const { t } = useLanguage();
  const rect = getFrameLabelRect(style);

  return (
    <div
      className={cn(
        'absolute z-10 flex cursor-text items-center justify-center px-1',
        editing && 'ring-2 ring-primary ring-offset-1 rounded-sm',
      )}
      style={{
        left: `${rect.left * 100}%`,
        top: `${rect.top * 100}%`,
        width: `${rect.width * 100}%`,
        height: `${rect.height * 100}%`,
      }}
      onClick={() => !editing && onStartEdit()}
      role="button"
      tabIndex={0}
      aria-label={t('style.frameLabelClickEdit')}
      onKeyDown={(e) => {
        if (!editing && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onStartEdit();
        }
      }}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 32))}
          onBlur={onCommit}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              e.preventDefault();
              onCommit();
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              onCancel();
            }
          }}
          className="w-full min-w-0 border-0 bg-transparent text-center font-bold outline-none"
          style={{ color: style.frameTextColor, fontSize: 'clamp(10px, 2.5vw, 15px)' }}
          maxLength={32}
        />
      ) : (
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
      )}
    </div>
  );
}
