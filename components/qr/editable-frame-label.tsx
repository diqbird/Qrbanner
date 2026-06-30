'use client';

import { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useShowQrDescription } from '@/components/site-settings-provider';
import {
  frameLabelVisible,
  getFrameLabelRect,
  patchFrameText,
  type QRStyleConfig,
} from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import { cn } from '@/lib/utils';

export function EditableFrameLabel({
  style,
  onChange,
}: {
  style: QRStyleConfig;
  onChange: (patch: Partial<QRStyleConfig>) => void;
}) {
  const { t } = useLanguage();
  const showQrDescription = useShowQrDescription();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(style.frameText);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(style.frameText);
  }, [style.frameText, editing]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    onChange(patchFrameText(style, draft));
  };

  const cancel = () => {
    setDraft(style.frameText);
    setEditing(false);
  };

  const startEdit = () => {
    if (style.frameStyle === 'none') {
      onChange({ frameStyle: 'scan-me', frameText: draft.trim() || style.frameText || 'Scan me' });
    }
    setEditing(true);
  };

  const visible = frameLabelVisible(style, { showQrDescription });
  const displayText = style.frameText?.trim() || t('style.frameLabelPlaceholder');

  if (!showQrDescription) {
    return null;
  }

  if (!visible) {
    return (
      <button
        type="button"
        onClick={startEdit}
        className="absolute -bottom-1 left-1/2 z-10 flex w-[min(100%,260px)] max-w-[calc(100%-0.5rem)] -translate-x-1/2 translate-y-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-3 py-2 text-center text-xs font-medium leading-snug text-primary whitespace-normal hover:border-primary hover:bg-primary/10 transition-colors"
      >
        <Pencil className="h-3 w-3 shrink-0" />
        {t('style.frameLabelClickToAdd')}
      </button>
    );
  }

  const rect = getFrameLabelRect(style);

  return (
    <div
      className={cn(
        'absolute z-10 flex cursor-text items-center justify-center px-1',
        editing && 'ring-2 ring-primary ring-offset-1 rounded-sm'
      )}
      style={{
        left: `${rect.left * 100}%`,
        top: `${rect.top * 100}%`,
        width: `${rect.width * 100}%`,
        height: `${rect.height * 100}%`,
      }}
      onClick={() => !editing && startEdit()}
      role="button"
      tabIndex={0}
      aria-label={t('style.frameLabelClickEdit')}
      onKeyDown={(e) => {
        if (!editing && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          startEdit();
        }
      }}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 32))}
          onBlur={commit}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
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
        </span>
      )}
    </div>
  );
}
