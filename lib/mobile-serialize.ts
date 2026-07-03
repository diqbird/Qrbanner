import { getPrimaryScanBaseUrl } from '@/lib/custom-domain';

type QrRow = {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  totalScans: number;
  isActive: boolean;
  updatedAt: Date;
  folder?: { name: string } | null;
};

export async function mobileScanUrl(userId: string, shortCode: string): Promise<string> {
  const base = await getPrimaryScanBaseUrl(userId);
  return `${base}/s/${shortCode}`;
}

export function serializeMobileQr(qr: QrRow, scanUrl: string) {
  return {
    id: qr.id,
    name: qr.name,
    shortCode: qr.shortCode,
    category: qr.category,
    scanUrl,
    totalScans: qr.totalScans,
    isActive: qr.isActive,
    folderName: qr.folder?.name ?? null,
    updatedAt: qr.updatedAt.toISOString(),
  };
}
