'use client';

import { useCallback } from 'react';
import type { GeofenceData } from '@/lib/geofence-shared';
import { MAX_GEOFENCE_RULES } from '@/lib/geofence-shared';

export function useGeofenceRuleActions(data: GeofenceData, onChange: (v: GeofenceData) => void) {
  const addRule = useCallback(() => {
    if (data.rules.length >= MAX_GEOFENCE_RULES) return;
    onChange({
      rules: [
        ...data.rules,
        {
          id: `rule-${Date.now()}`,
          countryCode: 'TR',
          city: '',
          url: '',
          label: '',
        },
      ],
    });
  }, [data.rules, onChange]);

  const updateRule = useCallback(
    (id: string, patch: Partial<GeofenceData['rules'][0]>) => {
      onChange({
        rules: data.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      });
    },
    [data.rules, onChange],
  );

  const removeRule = useCallback(
    (id: string) => {
      onChange({ rules: data.rules.filter((r) => r.id !== id) });
    },
    [data.rules, onChange],
  );

  return { addRule, updateRule, removeRule };
}
