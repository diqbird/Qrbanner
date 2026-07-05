export interface QrEditRecord {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  targetUrl: string;
  qrData: Record<string, string>;
  style: unknown;
  logoPath: string | null;
  logoIsPublic: boolean;
  isActive: boolean;
  totalScans: number;
  createdAt: string;
  hasPassword?: boolean;
  folderId?: string | null;
  labels?: string[];
}
