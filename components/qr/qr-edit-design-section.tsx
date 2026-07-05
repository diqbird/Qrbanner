'use client';

import { normalizeQRStyle } from '@/components/qr/qr-style-editor';
import { AiDesignAssistant } from '@/components/qr/ai-design-assistant';
import { StyleHistoryToolbar } from '@/components/qr/style-history-toolbar';
import { QRStyleEditor } from '@/components/qr/qr-style-editor';
import type { QrEditFormColumnProps } from '@/lib/qr-edit-form-column-types';

export function QrEditDesignSection({ form }: QrEditFormColumnProps) {
  const {
    qr,
    name,
    style,
    setStyle,
    undoStyle,
    redoStyle,
    canUndoStyle,
    canRedoStyle,
    logoPreview,
    storedLogoPath,
    handleLogoChange,
    applyTemplateLogo,
  } = form;

  if (!qr) return null;

  const category = qr.category ?? 'url';

  return (
    <>
      <AiDesignAssistant
        category={category}
        qrName={name}
        style={style}
        onApplyStyle={(patch) => setStyle(normalizeQRStyle({ ...style, ...patch }))}
        onLogoSize={(size) => setStyle(normalizeQRStyle({ ...style, logoSize: size }))}
      />

      <StyleHistoryToolbar
        canUndo={canUndoStyle}
        canRedo={canRedoStyle}
        onUndo={undoStyle}
        onRedo={redoStyle}
      />

      <QRStyleEditor
        style={style}
        onStyleChange={(next) => setStyle(normalizeQRStyle(next))}
        onLogoChange={handleLogoChange}
        logoPreview={logoPreview}
        logoPath={storedLogoPath}
        onTemplateLogoApply={applyTemplateLogo}
      />
    </>
  );
}
