'use client';

import { useShowQrDescription } from '@/components/site-settings-provider';
import type { QRStyleConfig } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import { useEditableFrameLabel } from '@/hooks/use-editable-frame-label';
import { EditableFrameLabelEmpty } from './editable-frame-label-empty';
import { EditableFrameLabelOverlay } from './editable-frame-label-overlay';

export function EditableFrameLabel({
  style,
  onChange,
}: {
  style: QRStyleConfig;
  onChange: (patch: Partial<QRStyleConfig>) => void;
}) {
  const { t } = useLanguage();
  const showQrDescription = useShowQrDescription();
  const label = useEditableFrameLabel({ style, onChange, showQrDescription });
  const { editing, draft, setDraft, inputRef, visible, commit, cancel, startEdit, removeLabel } = label;

  const displayText = style.frameText?.trim() || t('style.frameLabelPlaceholder');

  if (!showQrDescription) return null;
  if (!visible) return <EditableFrameLabelEmpty onStartEdit={startEdit} />;

  return (
    <EditableFrameLabelOverlay
      style={style}
      displayText={displayText}
      editing={editing}
      draft={draft}
      setDraft={setDraft}
      inputRef={inputRef}
      onStartEdit={startEdit}
      onCommit={commit}
      onCancel={cancel}
      onRemove={removeLabel}
    />
  );
}
