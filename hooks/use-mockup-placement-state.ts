'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  type MockupKey,
  type MockupPlacement,
  mockupDefaultsFor,
  MOCKUP_CUSTOM_DEFAULTS,
} from '@/lib/mockup-presets';

export function useMockupPlacementState(active: MockupKey) {
  const [placements, setPlacements] = useState<Partial<Record<MockupKey, MockupPlacement>>>({});

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

  const initCustomPlacement = () => {
    setPlacements((prev) => ({
      ...prev,
      custom: prev.custom ?? { ...MOCKUP_CUSTOM_DEFAULTS },
    }));
  };

  return { placement, updatePlacement, resetPlacement, initCustomPlacement };
}
