export interface CreatedQR {
  id: string;
  name: string;
  shortCode: string;
  category: string;
}

export interface BulkResult {
  batchId: string;
  batchLabel: string | null;
  created: CreatedQR[];
  failed: import('@/lib/bulk-csv').BulkParseError[];
  summary: { total: number; success: number; failed: number };
}

export interface UsageInfo {
  maxBulkRows: number;
  qrLimit: number;
  qrCodes: number;
  planName: string;
}

export const defaultBulkUsage: UsageInfo = {
  maxBulkRows: 100,
  qrLimit: 25,
  qrCodes: 0,
  planName: 'Free',
};
