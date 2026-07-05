'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { clampMockupPct, clampMockupSize, type MockupPlacement } from '@/lib/mockup-presets';

export function useMockupPointerHandlers({
  containerRef,
  placement,
  updatePlacement,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  placement: MockupPlacement;
  updatePlacement: (patch: Partial<MockupPlacement>) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const resizeStartRef = useRef({ size: 0, clientY: 0 });

  const positionFromPointer = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      left: clampMockupPct(((clientX - rect.left) / rect.width) * 100),
      top: clampMockupPct(((clientY - rect.top) / rect.height) * 100),
    };
  };

  const onQrPointerDown = (e: ReactPointerEvent<HTMLDivElement>, hasQr: boolean) => {
    if (!hasQr || resizing) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onQrPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (resizing) {
      const delta = (resizeStartRef.current.clientY - e.clientY) * 0.12;
      updatePlacement({ size: clampMockupSize(resizeStartRef.current.size + delta) });
      return;
    }
    if (!dragging) return;
    const pos = positionFromPointer(e.clientX, e.clientY);
    if (pos) updatePlacement(pos);
  };

  const onQrPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging || resizing) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDragging(false);
      setResizing(false);
    }
  };

  const onResizeHandleDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const wrapper = e.currentTarget.parentElement;
    if (!wrapper) return;
    resizeStartRef.current = { size: placement.size, clientY: e.clientY };
    setResizing(true);
    wrapper.setPointerCapture(e.pointerId);
  };

  const onQrWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -2 : 2;
    updatePlacement({ size: clampMockupSize(placement.size + delta) });
  };

  const nudgeSize = (delta: number) => {
    updatePlacement({ size: clampMockupSize(placement.size + delta) });
  };

  return {
    dragging,
    resizing,
    onQrPointerDown,
    onQrPointerMove,
    onQrPointerUp,
    onResizeHandleDown,
    onQrWheel,
    nudgeSize,
  };
}
