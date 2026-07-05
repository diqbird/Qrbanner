'use client';

import { getFrameLabelRect, type QRStyleConfig } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import { cn } from '@/lib/utils';
import type { MouseEvent, RefObject } from 'react';
import { EditableFrameLabelEditInput } from './editable-frame-label-edit-input';
import { EditableFrameLabelDisplay } from './editable-frame-label-display';

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
        <EditableFrameLabelEditInput
          style={style}
          draft={draft}
          setDraft={setDraft}
          inputRef={inputRef}
          onCommit={onCommit}
          onCancel={onCancel}
        />
      ) : (
        <EditableFrameLabelDisplay style={style} displayText={displayText} onRemove={onRemove} />
      )}
    </div>
  );
}
