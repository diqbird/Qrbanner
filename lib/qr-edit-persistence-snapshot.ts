import type { QrFeatureFields } from '@/hooks/use-qr-feature-fields';
import type { QRStyleConfig } from '@/lib/qr-style';

export type QrEditPersistenceSnapshotInput = {
  name: string;
  qrData: Record<string, string>;
  style: QRStyleConfig;
  isActive: boolean;
  storedLogoPath: string | null;
  advanced: QrFeatureFields['advanced'];
  landingEnabled: boolean;
  landingPage: QrFeatureFields['landingPage'];
  scheduleEnabled: boolean;
  scheduleData: QrFeatureFields['scheduleData'];
  geofenceEnabled: boolean;
  geofenceData: QrFeatureFields['geofenceData'];
  abTestEnabled: boolean;
  abTestData: QrFeatureFields['abTestData'];
  gpsHeatmapEnabled: boolean;
  nfcEnabled: boolean;
  scanNotify: QrFeatureFields['scanNotify'];
  folderId: string | null;
  labels: string[];
  pixels: QrFeatureFields['pixels'];
  removePassword: boolean;
};

export function buildQrEditPersistenceSnapshotInput(
  input: QrEditPersistenceSnapshotInput,
): QrEditPersistenceSnapshotInput {
  return input;
}
