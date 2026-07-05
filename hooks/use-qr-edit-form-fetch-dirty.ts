'use client';

import { useQrEditFetch } from '@/hooks/use-qr-edit-fetch';
import { useQrEditFormSnapshot } from '@/hooks/use-qr-edit-form-snapshot';
import { useQrEditDirty } from '@/hooks/use-qr-edit-dirty';
import type { useQrEditHydrateSetters } from '@/hooks/use-qr-edit-hydrate-setters';
import {
  buildQrEditPersistenceSnapshotInput,
  type QrEditPersistenceSnapshotInput,
} from '@/lib/qr-edit-persistence-snapshot';

type HydrateSetters = ReturnType<typeof useQrEditHydrateSetters>;

export function useQrEditFormFetchDirty({
  qrId,
  hydrateSetters,
  snapshotFields,
  logoFile,
}: {
  qrId: string;
  hydrateSetters: HydrateSetters;
  snapshotFields: QrEditPersistenceSnapshotInput;
  logoFile: File | null;
}) {
  const { qr, loading, fetchQR } = useQrEditFetch(qrId, hydrateSetters);

  const snapshotInput = useQrEditFormSnapshot(buildQrEditPersistenceSnapshotInput(snapshotFields));

  const { markSaved } = useQrEditDirty(loading, qr?.id, snapshotInput, logoFile);

  return { qr, loading, fetchQR, markSaved };
}
