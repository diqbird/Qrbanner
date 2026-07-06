'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  clearFrameLabel,
  frameLabelVisible,
  patchFrameText,
  type QRStyleConfig,
} from '@/lib/qr-style';

export function useEditableFrameLabel({
  style,
  onChange,
  showQrDescription,
  defaultFrameText = 'Scan me',
}: {
  style: QRStyleConfig;
  onChange: (patch: Partial<QRStyleConfig>) => void;
  showQrDescription: boolean;
  defaultFrameText?: string;
}) {
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
    if (!draft.trim()) {
      onChange(clearFrameLabel());
      return;
    }
    onChange(patchFrameText(style, draft));
  };

  const cancel = () => {
    setDraft(style.frameText);
    setEditing(false);
  };

  const startEdit = () => {
    if (style.frameStyle === 'none') {
      onChange({ frameStyle: 'scan-me', frameText: draft.trim() || style.frameText || defaultFrameText });
    }
    setEditing(true);
  };

  const removeLabel = (e: MouseEvent) => {
    e.stopPropagation();
    setEditing(false);
    setDraft('');
    onChange(clearFrameLabel());
  };

  const visible = frameLabelVisible(style, { showQrDescription });

  return {
    editing,
    draft,
    setDraft,
    inputRef,
    visible,
    commit,
    cancel,
    startEdit,
    removeLabel,
  };
}

export type EditableFrameLabelState = ReturnType<typeof useEditableFrameLabel>;
