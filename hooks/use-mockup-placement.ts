'use client';

import { useRef } from 'react';
import type { MockupKey } from '@/lib/mockup-presets';
import { useMockupPlacementState } from '@/hooks/use-mockup-placement-state';
import { useMockupPointerHandlers } from '@/hooks/use-mockup-pointer-handlers';

export function useMockupPlacement(active: MockupKey) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { placement, updatePlacement, resetPlacement, initCustomPlacement } = useMockupPlacementState(active);
  const pointerHandlers = useMockupPointerHandlers({ containerRef, placement, updatePlacement });

  return {
    containerRef,
    placement,
    updatePlacement,
    resetPlacement,
    initCustomPlacement,
    ...pointerHandlers,
  };
}
