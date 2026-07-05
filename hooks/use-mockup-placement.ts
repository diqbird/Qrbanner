'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  type MockupKey,
  type MockupPlacement,
  mockupDefaultsFor,
  clampMockupPct,
  clampMockupSize,
  MOCKUP_CUSTOM_DEFAULTS,
} from '@/lib/mockup-presets';

export function useMockupPlacement(active: MockupKey) {
  const [placements, setPlacements] = useState<Partial<Record<MockupKey, MockupPlacement>>>({});
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef({ size: 0, clientY: 0 });

  const placement = placements[active] ?? mockupDefaultsFor(active);

  useEffect(() => {
    setPlacements((prev) => {
      if (prev[active]) return prev;
      return { ...prev, [active]: mockupDefaultsFor(active) };
    });
  }, [active]);

  const updatePlacement = useCallback(
    (patch: Partial<MockupPlacement>) => {
      setPlacements((prev) => ({
        ...prev,
        [active]: { ...(prev[active] ?? mockupDefaultsFor(active)), ...patch },
      }));
    },
    [active],
  );

  const resetPlacement = useCallback(() => {
    setPlacements((prev) => ({ ...prev, [active]: mockupDefaultsFor(active) }));
  }, [active]);

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

  const initCustomPlacement = () => {
    setPlacements((prev) => ({
      ...prev,
      custom: prev.custom ?? { ...MOCKUP_CUSTOM_DEFAULTS },
    }));
  };

  return {
    containerRef,
    placement,
    dragging,
    resizing,
    updatePlacement,
    resetPlacement,
    onQrPointerDown,
    onQrPointerMove,
    onQrPointerUp,
    onResizeHandleDown,
    onQrWheel,
    nudgeSize,
    initCustomPlacement,
  };
}
