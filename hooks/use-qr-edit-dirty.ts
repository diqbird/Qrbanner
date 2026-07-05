'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useUnsavedChangesGuard } from '@/hooks/use-unsaved-changes-guard';
import { editFormSnapshot, type QrEditFormSnapshotInput } from '@/lib/qr-edit-form-utils';

export function useQrEditDirty(
  loading: boolean,
  qrId: string | undefined,
  snapshotInput: QrEditFormSnapshotInput,
  logoFile: File | null,
) {
  const [baseline, setBaseline] = useState<string | null>(null);
  const [baselineTick, setBaselineTick] = useState(0);

  const formSnapshot = useMemo(() => editFormSnapshot(snapshotInput), [snapshotInput]);

  const isDirty = Boolean(logoFile) || (baseline !== null && formSnapshot !== baseline);
  useUnsavedChangesGuard(isDirty);

  const formSnapshotRef = useRef(formSnapshot);
  formSnapshotRef.current = formSnapshot;

  useEffect(() => {
    if (loading || !qrId) {
      setBaseline(null);
      return;
    }
    setBaseline(formSnapshotRef.current);
  }, [loading, qrId, baselineTick]);

  const markSaved = () => setBaselineTick((n) => n + 1);

  return { isDirty, markSaved };
}
