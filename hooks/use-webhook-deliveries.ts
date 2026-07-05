'use client';

import { useCallback, useEffect, useState } from 'react';
import type { DeliveryRow } from '@/lib/webhook-types';

export function useWebhookDeliveries() {
  const [deliveries, setDeliveries] = useState<DeliveryRow[]>([]);

  const fetchDeliveries = useCallback(async () => {
    try {
      const res = await fetch('/api/webhooks/deliveries?limit=20');
      if (res.ok) {
        const json = await res.json();
        setDeliveries(json.deliveries ?? []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return { deliveries, fetchDeliveries };
}
