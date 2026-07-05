export interface QRCodeItem {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  targetUrl: string;
  isActive: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  totalScans: number;
  batchId?: string | null;
  batchLabel?: string | null;
  folderId?: string | null;
  labels?: string[];
  folder?: { id: string; name: string; color: string } | null;
  createdAt: string;
}
