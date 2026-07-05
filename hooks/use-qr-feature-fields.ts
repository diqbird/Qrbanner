'use client';

export type { QrFeatureRecord } from '@/lib/qr-feature-fields-types';
export { buildQrFeaturePayload } from '@/lib/qr-feature-fields-utils';
export type { QrFeaturePayloadInput } from '@/lib/qr-feature-fields-types';

import { useQrFeatureFieldsState } from '@/hooks/use-qr-feature-fields-state';

/** Shared advanced + feature toggles used by create wizard and edit view. */
export function useQrFeatureFields() {
  return useQrFeatureFieldsState();
}

export type QrFeatureFields = ReturnType<typeof useQrFeatureFields>;
