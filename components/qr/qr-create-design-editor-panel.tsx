'use client';

import { QRStyleEditor } from './qr-style-editor';
import { AiDesignAssistant } from './ai-design-assistant';
import { normalizeQRStyle } from '@/lib/qr-style';
import { StyleHistoryToolbar } from './style-history-toolbar';
import { QrCreateAdvancedOptionsPanel } from './qr-create-advanced-options-panel';
import type { QrCreateStepDesignProps } from '@/lib/qr-create-step-design-types';

export function QrCreateDesignEditorPanel(props: QrCreateStepDesignProps) {
  const {
    category,
    name,
    style,
    logoPreview,
    activeTemplate,
    onStyleChange,
    canUndoStyle,
    canRedoStyle,
    onUndoStyle,
    onRedoStyle,
    onLogoChange,
    logoPath,
    onTemplateLogoApply,
  } = props;

  return (
    <div className="order-2 space-y-6 lg:order-1">
      <AiDesignAssistant
        category={category}
        qrName={name}
        style={style}
        onApplyStyle={(patch) => onStyleChange(normalizeQRStyle({ ...style, ...patch }))}
        onLogoSize={(size) => onStyleChange(normalizeQRStyle({ ...style, logoSize: size }))}
      />
      {(onUndoStyle || onRedoStyle) && (
        <StyleHistoryToolbar
          canUndo={!!canUndoStyle}
          canRedo={!!canRedoStyle}
          onUndo={onUndoStyle ?? (() => {})}
          onRedo={onRedoStyle ?? (() => {})}
        />
      )}
      <QRStyleEditor
        style={style}
        highlightVisualPresetId={activeTemplate?.visualPresetId}
        onStyleChange={(next) => onStyleChange(normalizeQRStyle(next))}
        onLogoChange={onLogoChange}
        logoPreview={logoPreview}
        logoPath={logoPath ?? null}
        onTemplateLogoApply={onTemplateLogoApply}
      />
      <QrCreateAdvancedOptionsPanel {...props} />
    </div>
  );
}
