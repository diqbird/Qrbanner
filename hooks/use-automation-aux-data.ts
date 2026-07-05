'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AutomationLogRow, AutomationQrOption } from '@/lib/automation-flow-utils';

export function useAutomationAuxData() {
  const [logs, setLogs] = useState<AutomationLogRow[]>([]);
  const [qrOptions, setQrOptions] = useState<AutomationQrOption[]>([]);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/automations/logs?limit=20');
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs ?? []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const fetchQrOptions = useCallback(async () => {
    try {
      const res = await fetch('/api/qr?limit=200');
      if (res.ok) {
        const json = await res.json();
        const rows = (json.qrCodes ?? json.codes ?? []) as AutomationQrOption[];
        setQrOptions(rows.map((q) => ({ id: q.id, name: q.name, shortCode: q.shortCode })));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchQrOptions();
  }, [fetchLogs, fetchQrOptions]);

  return { logs, qrOptions, fetchLogs };
}

export type AutomationAuxDataState = ReturnType<typeof useAutomationAuxData>;
