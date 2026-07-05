'use client';

import { useQrEditSave } from '@/hooks/use-qr-edit-save';
import { useQrEditFormFetchDirty } from '@/hooks/use-qr-edit-form-fetch-dirty';
import type { useQrEditHydrateSetters } from '@/hooks/use-qr-edit-hydrate-setters';
import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import {
  pickQrEditPersistenceSnapshot,
  type QrEditFormPersistenceFields,
} from '@/lib/qr-edit-form-persistence-fields';

type HydrateSetters = ReturnType<typeof useQrEditHydrateSetters>;

export function useQrEditFormPersistence({
  qrId,
  hydrateSetters,
  logoFile,
  featureFields,
  setLogoFile,
  setSaving,
  t,
  ...snapshotFields
}: QrEditFormPersistenceFields & {
  qrId: string;
  hydrateSetters: HydrateSetters;
  logoFile: File | null;
  featureFields: QrFeatureFields;
  setLogoFile: (f: File | null) => void;
  setSaving: (v: boolean) => void;
  t: (key: string) => string;
}) {
  const { qr, loading, fetchQR, markSaved } = useQrEditFormFetchDirty({
    qrId,
    hydrateSetters,
    snapshotFields: pickQrEditPersistenceSnapshot(snapshotFields),
    logoFile,
  });

  const { handleSave } = useQrEditSave({
    qrId,
    qr,
    logoFile,
    featureFields,
    setLogoFile,
    markSaved,
    fetchQR,
    t,
    setSaving,
    ...snapshotFields,
  });

  return { qr, loading, handleSave };
}
