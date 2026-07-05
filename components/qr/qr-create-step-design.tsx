'use client';

export type { QrCreateStepDesignProps } from '@/lib/qr-create-step-design-types';
import { QrCreateDesignEditorPanel } from './qr-create-design-editor-panel';
import { QrCreateDesignPreviewPanel } from './qr-create-design-preview-panel';
import type { QrCreateStepDesignProps } from '@/lib/qr-create-step-design-types';

export function QrCreateStepDesign(props: QrCreateStepDesignProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <QrCreateDesignEditorPanel {...props} />
      <QrCreateDesignPreviewPanel {...props} />
    </div>
  );
}
