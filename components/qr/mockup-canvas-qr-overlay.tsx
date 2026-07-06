'use client';

import { Maximize2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { MockupPreviewState } from '@/hooks/use-mockup-preview';

export function MockupCanvasQrOverlay({
  mockup,
  qrDataUrl,
  backgroundImage,
}: {
  mockup: MockupPreviewState;
  qrDataUrl: string | null;
  backgroundImage: string | null;
}) {
  const { t } = useLanguage();
  const {
    placement,
    dragging,
    resizing,
    invertQr,
    onQrPointerDown,
    onQrPointerMove,
    onQrPointerUp,
    onResizeHandleDown,
    onQrWheel,
  } = mockup;

  if (!qrDataUrl || !backgroundImage) {
    if (backgroundImage) {
      return (
        <p className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-white drop-shadow">
          {t('mockup.generateFirst')}
        </p>
      );
    }
    return null;
  }

  return (
    <div
      className={`absolute touch-none ${
        dragging ? 'cursor-grabbing' : resizing ? 'cursor-se-resize' : 'cursor-grab'
      }`}
      style={{
        width: `${placement.size}%`,
        top: `${placement.top}%`,
        left: `${placement.left}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onPointerDown={(e) => onQrPointerDown(e, Boolean(qrDataUrl))}
      onPointerMove={onQrPointerMove}
      onPointerUp={onQrPointerUp}
      onPointerCancel={onQrPointerUp}
      onWheel={onQrWheel}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrDataUrl}
        alt=""
        className={`w-full rounded-sm bg-white p-0.5 shadow-lg ring-1 ring-black/10 ${
          dragging || resizing ? 'ring-2 ring-primary' : ''
        }`}
        style={{ filter: invertQr ? 'invert(1)' : undefined }}
        draggable={false}
      />
      <button
        type="button"
        aria-label={t('mockup.resizeQr')}
        className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md hover:scale-110 active:scale-95"
        onPointerDown={onResizeHandleDown}
      >
        <Maximize2 className="h-2.5 w-2.5" />
      </button>
    </div>
  );
}
