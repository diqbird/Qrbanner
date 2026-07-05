'use client';

import type { RefObject } from 'react';
import type { QRStyleConfig } from '@/lib/qr-style';

export function EditableFrameLabelEditInput({
  style,
  draft,
  setDraft,
  inputRef,
  onCommit,
  onCancel,
}: {
  style: QRStyleConfig;
  draft: string;
  setDraft: (v: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  onCommit: () => void;
  onCancel: () => void;
}) {
  return (
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
  );
}
