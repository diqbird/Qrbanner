'use client';

import type { MockupPreviewState } from '@/hooks/use-mockup-preview';
import { MockupCanvasBackground } from './mockup-canvas-background';
import { MockupCanvasQrOverlay } from './mockup-canvas-qr-overlay';

export function MockupCanvas({
  mockup,
  qrDataUrl,
}: {
  mockup: MockupPreviewState;
  qrDataUrl: string | null;
}) {
  const { containerRef, backgroundImage, aspectStyle, fileInputRef } = mockup;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-sm touch-none overflow-hidden rounded-xl border bg-muted shadow-inner select-none"
      style={aspectStyle}
    >
      <MockupCanvasBackground backgroundImage={backgroundImage} fileInputRef={fileInputRef} />
      <MockupCanvasQrOverlay mockup={mockup} qrDataUrl={qrDataUrl} backgroundImage={backgroundImage} />
    </div>
  );
}
