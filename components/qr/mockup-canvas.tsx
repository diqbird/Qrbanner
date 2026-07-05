'use client';

import { Upload, Maximize2 } from 'lucide-react';
import type { MockupPreviewState } from '@/hooks/use-mockup-preview';

export function MockupCanvas({
  mockup,
  qrDataUrl,
}: {
  mockup: MockupPreviewState;
  qrDataUrl: string | null;
}) {
  const {
    containerRef,
    placement,
    dragging,
    resizing,
    backgroundImage,
    invertQr,
    aspectStyle,
    fileInputRef,
    onQrPointerDown,
    onQrPointerMove,
    onQrPointerUp,
    onResizeHandleDown,
    onQrWheel,
  } = mockup;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-sm touch-none overflow-hidden rounded-xl border bg-muted shadow-inner select-none"
      style={aspectStyle}
    >
      {backgroundImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/10" aria-hidden />
        </>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/80 p-4 text-center text-sm text-muted-foreground hover:bg-muted"
        >
          <Upload className="h-8 w-8 opacity-50" />
          <span>Upload your photo (JPG, PNG, WebP)</span>
        </button>
      )}

      {qrDataUrl && backgroundImage ? (
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
            alt="QR on mockup"
            className={`w-full rounded-sm bg-white p-0.5 shadow-lg ring-1 ring-black/10 ${
              dragging || resizing ? 'ring-2 ring-primary' : ''
            }`}
            style={{ filter: invertQr ? 'invert(1)' : undefined }}
            draggable={false}
          />
          <button
            type="button"
            aria-label="Resize QR"
            className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md hover:scale-110 active:scale-95"
            onPointerDown={onResizeHandleDown}
          >
            <Maximize2 className="h-2.5 w-2.5" />
          </button>
        </div>
      ) : !backgroundImage ? null : (
        <p className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-white drop-shadow">
          Generate preview first
        </p>
      )}
    </div>
  );
}
